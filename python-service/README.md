# Python service 

## Resumo
Serviço em Go responsável por:
* Coletar dados meteorológicos da região de Carapicuíba via Open-Meteo
* Normalizar e formatar os dados em JSON
* Enviar os registros para a fila Redis, que será consumida pelo Go Worker
* Rodar periodicamente a coleta a cada 5 minutos (a Open-Meteo atualiza a cada 15 minutos)

**Observação**: Este serviço só funciona integrado via Docker Compose. Não há execução local independente.

---

## Subindo o serviço
Para iniciar o React Dashboard junto com todos os serviços necessários, utilize o Docker Compose a partir da raiz do projeto:
``` bash
  docker compose up python-service
```
Isso garante que o frontend consiga se comunicar corretamente com a API NestJS, Redis, MongoDB e os workers.

Para subir todos os serviços da aplicação de uma vez:
``` bash
  docker compose up --build
```

---

## Formato do JSON enviado ao Redis
``` JSON
{
    "time": "timestamp da leitura",
    "temperature": 28,
    "windspeed": 5,
    "windDirection": 180,
    "isDay": true,
    "weatherCode": 3,
    "humidity": 70
}
```

--


## Logs

Visualize os logs da API via Docker Compose:
``` bash
    docker compose logs python-service
```
Os logs incluem:
* Início da coleta de dados
* Requisições à Open-Meteo
* Envio de mensagens para Redis
* Status de sucesso ou falhas na fila

---

## Observações
* Depende do Redis, Go e Nest estarem ativo no Docker Compose
* Intervalo de coleta: 5 minutos (API Open-Meteo atualiza a cada 15 minutos)
* JSON enviado é consumido pelo Go Worker para integração com a NestJS API
* Este serviço não deve ser executado isoladamente sem os outros componentes