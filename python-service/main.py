import requests # type: ignore
import redis # type: ignore
import json
import time
import traceback

## ===== configurações basicas =====
REDIS_HOST = 'redis'
STREAM_KEY = 'weather'

## ===== Localidade [carapicuiba] =====
LATITUDE = -23.5227
LONGITUDE = -46.84

## ===== deley [5 min] =====
DELEY_MINNUTOS = 5
DELEY_SEGUNDOS = DELEY_MINNUTOS * 60 # deley em segundos

# obtem os dados de clima 
def obter_clima():
    URL = 'https://api.open-meteo.com/v1/forecast'
    
    params={
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "current_weather": True,
        "hourly": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
    }
    
    try:
        request = requests.get(URL,params=params, timeout=10)
        request.raise_for_status()
        response = request.json()
                
        return response
    except Exception as e:
        print("Erro ao obter dados do clima:", e)
        traceback.print_exc()
        return None

# salva os dados formatados no redis
def salvar_no_redis(redis_client, data):
    try:
        payload = json.dumps(data)
        redis_client.xadd(STREAM_KEY, {"payload": payload})
        print("salvo:", payload)
    except Exception as e:
        print("Erro ao salvar dados no Redis:", e)
        traceback.print_exc()

# formatar em formato de JSON
def format_clima(raw):
    try:
        current = raw["current_weather"]
        
        try:
            index = raw['hourly']['time'].index(current['time'])
            humidity = raw['hourly']['relative_humidity_2m'][index]
        except ValueError:
            humidity = 0
        
        def safe_int(value, default=0):
            try:
                return int(value)
            except:
                return default
        
        return {
            "time": current.get("time"),
            "temperature": safe_int(current.get("temperature")),
            "windspeed": safe_int(current.get("windspeed")),
            "windDirection": safe_int(current.get("winddirection")),
            "isDay": current.get("is_day") == 1,
            "weatherCode": safe_int(current.get("weathercode")),
            "humidity": safe_int(humidity),
        }
    except Exception as e:
        print("Erro ao formatar dados do clima:", e)
        traceback.print_exc()
        return None

def main():
    print("Tentando conectar no Redis...")
    redis_client = redis.Redis(
        host = REDIS_HOST,
        port = 6379,
        decode_responses = True,
    )
    print("Conexão sucedida com redis...")
    
    while True:
        print('Obter dados do tempo')
        dados_do_tempo = obter_clima()
        
        if(dados_do_tempo):
            print('Formatar dados')
            dados_formatado = format_clima(dados_do_tempo)
            
            if(dados_formatado):
                print('Salvando no Redis')
                salvar_no_redis(redis_client=redis_client, data=dados_formatado)
        
        # deley de tempo
        time.sleep(DELEY_SEGUNDOS)

# rodar se for o main
if( __name__ == '__main__'):
    main()