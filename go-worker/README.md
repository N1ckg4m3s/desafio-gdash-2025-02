# Go worker (mensageria) 

## Resumo
Serviço em Go responsável por:
* Consumir mensagens da fila Redis enviadas pelo Python Service
* Validar e transformar os dados meteorológicos
* Enviar os registros para a API NestJS (POST /weather)
* Gerenciar retries básicos e ack/nack das mensagens
* Registrar logs detalhados das operações

**Observação**: Este serviço só funciona integrado via Docker Compose. Não há execução local independente.

---

## Subindo o serviço
Para iniciar o React Dashboard junto com todos os serviços necessários, utilize o Docker Compose a partir da raiz do projeto:
``` bash
  docker compose up go-worker
```
Isso garante que o frontend consiga se comunicar corretamente com a API NestJS, Redis, MongoDB e os workers.

Para subir todos os serviços da aplicação de uma vez:
``` bash
  docker compose up --build
```

---

## Funcionalidades
* Consome dados meteorológicos da fila Redis
* Valida e transforma os dados, se necessário
* Envia registros para o NestJS API (POST /weather)
* Implementa retry básico para falhas na comunicação
* Logs detalhados ajudam a rastrear o fluxo completo: Python → Redis → Go → NestJS

---

## Logs

Visualize os logs da API via Docker Compose:
``` bash
    docker compose logs go-worker
```
Os logs incluem:
* Mensagens consumidas do Redis
* Transformações aplicadas nos dados
* Envios para a API NestJS e status de ack/nack

---

## Observações
* Depende do Redis e do NestJS API estarem ativos no Docker Compose
* Não há execução standalone sem os outros componentes
* Permite rastrear e depurar o pipeline completo de dados meteorológicos