package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	streamName   = "weather"
	groupName    = "weather-group"
	consumerName = "worker-1"
	postUrl      = "http://nest-api:3000/weather"
)

// Struck dos dados de tempo
type WeatherData struct {
	Time          string  `json:"time"`
	Temperature   float64 `json:"temperature"`
	WindSpeed     float64 `json:"windspeed"`
	WindDirection int     `json:"windDirection"`
	IsDay         bool    `json:"isDay"`
	WeatherCode   int     `json:"weatherCode"`
	Humidity      int     `json:"humidity"`
}

// Criar conexão com redis
func connectRedis() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr: "redis:6379", // localhost:6379
		DB:   0,
	})
}

// Verifica se tem o grupo
func ensureGroup(rdb *redis.Client, ctx context.Context) {
	err := rdb.XGroupCreateMkStream(ctx, streamName, groupName, "$").Err()
	if err != nil && !strings.Contains(err.Error(), "BUSYGROUP") {
		log.Fatal("Erro criando consumer group:", err)
	}
}

// Obtem as mensagens do Redis
func readMessages(rdb *redis.Client, ctx context.Context) []redis.XMessage {
	res, err := rdb.XReadGroup(ctx, &redis.XReadGroupArgs{
		Group:    groupName,
		Consumer: consumerName,
		Streams:  []string{streamName, ">"},
		Count:    1,
		Block:    0,
	}).Result()

	if err != nil && err != redis.Nil {
		fmt.Println("Erro lendo mensagens:", err)
		time.Sleep(2 * time.Second) // backoff
		return nil
	}

	if len(res) == 0 {
		return nil
	}

	return res[0].Messages
}

func ackMessage(rdb *redis.Client, ctx context.Context, id string) {
	if err := rdb.XAck(ctx, streamName, groupName, id).Err(); err != nil {
		log.Println("Erro ao dar ACK:", err)
	}
}

// Transformar os dados em objeto
func parseWeather(values map[string]interface{}) (WeatherData, error) {
	payload, ok := values["payload"].(string)
	if !ok {
		return WeatherData{}, fmt.Errorf("payload não é uma string")
	}

	var data WeatherData
	if err := json.Unmarshal([]byte(payload), &data); err != nil {
		return WeatherData{}, fmt.Errorf("falha ao fazer unmarshal: %w", err)
	}

	return data, nil
}

// Enviar para o nest
var client = &http.Client{Timeout: 10 * time.Second}

func sendToNest(data WeatherData) bool {
	jsonData, _ := json.Marshal(data)

	for i := 0; i < 3; i++ { // tenta 3x
		resp, err := client.Post(postUrl, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Println("Erro no POST, retry:", i+1, err)
			time.Sleep(2 * time.Second)
			continue
		}

		defer resp.Body.Close()
		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			return true
		}

		fmt.Println("Status do POST inválido, retry:", resp.Status)
		time.Sleep(2 * time.Second)
	}

	return false
}

func main() {
	CTX := context.Background()
	redisClient := connectRedis()

	// Verifica a existencia do Group.
	ensureGroup(redisClient, CTX)

	for {
		msgs := readMessages(redisClient, CTX)
		if msgs == nil {
			continue
		}

		for _, msg := range msgs {
			fmt.Print("Mensagem recebida, tranformando em [object]")
			msgParse, err := parseWeather(msg.Values)
			if err != nil {
				fmt.Println("Erro ao parsear mensagem:", err)
				ackMessage(redisClient, CTX, msg.ID)
				continue
			}

			if sendToNest(msgParse) {
				fmt.Println("Sucesso, mensagem ACKed:", msg.ID)
				ackMessage(redisClient, CTX, msg.ID)
			} else {
				fmt.Println("Falha ao enviar para o Nest, mensagem não ACKed:", msg.ID)
			}
		}
	}
}
