# Resolução Desafio Técnico GDASH 2025/02

## Resumo
Aplicação full-stack que coleta dados meteorológicos de Carapicuíba via Open-Meteo, processa-os por um worker em Go, armazena no NestJS/MongoDB, gera insights de IA e apresenta um Dashboard em React + Vite + Tailwind + shadcn/ui.

## Arquitetura

O fluxo geral é:
* Python-Service (coleta Open-Meteo) →
* Redis (Message Broker) →
* Go Worker (validação e envio) →
* NestJS API + MongoDB (armazenamento + insights de IA) →
* React Dashboard (visualização + CRUD usuários + export CSV/XLSX)

Serviços Docker incluídos:
* mongo → MongoDB 7.0, replicaset rs0
* redis → Redis 7
* python-service → coleta de clima a cada 5 min
* go-worker → processa mensagens da fila e envia para NestJS
* nest-api → API NestJS, endpoints clima, usuários, insights
* react-dashboard → frontend React + Vite

---

## Python Service (Coleta de clima)

* **API usada**: Open-Meteo
* **Intervalo de coleta**: 5 minutos (a API atualiza a cada 15 minutos)
* Formato JSON enviado para Redis:
```JSON
{
    "time": "",         // timestamp da leitura
    "temperature": 0,   // temperatura atual
    "windspeed": 0,     //velocidade do vento
    "windDirection": 0, // direção do vento
    "isDay": true,      // boolean indicando se é dia
    "weatherCode": 0,   //código da condição climática
    "humidity": 0,      // umidade,
}
```
Este serviço envia os dados para o Redis como fila de mensagens.

---

## Go Worker
* **Função**: consumir mensagens do Redis, validar e enviar para o NestJS (POST /weather)
* **Recursos**: retry básico, ack/nack e logs detalhados

---

## NestJS API
Coleção MongoDB: **weather**

### Endpoints principais:
* **POST**  |   /weather → salvar log de clima
* **GET**   |   /weather → listar logs
* **GET**   |   /weather/list → histórico detalhado
* **GET**   |   /weather/insights → gerar insights de IA
* **GET**   |   /weather/export.csv → exportar CSV
* **GET**   |   /weather/export.xlsx → exportar XLSX
* **POST**  |   /auth → autenticação

### Acesso
**Roles:** Admin, User
* CRUD de usuários (roles: admin/user, acesso restrito via AuthGuard)
* Usuário padrão criado automaticamente via variáveis do .env
* Insights de IA: gerados a partir dos dados do dia

---

## React Dashboard

**URL**: http://localhost:8080

### Páginas:
* / → Login
* /dashboard → Dashboard clima + insights
* - Gráficos: temperatura e umidade usando Recharts
* /users → CRUD de usuários (apenas admin)

### Funcionalidades:
exibição de dados meteorológicos em tempo real, exportação CSV/XLSX, CRUD de usuários

---

## Docker Compose
Comando único para subir tudo: `docker compose up --build`
Serviços inclusos: mongo, redis, python-service, go-worker, nest-api, react-dashboard

---

## Variáveis de Ambiente

**Raiz**: 
```
    DOCKERFILE → 'Dockerfile.dev' ou 'Dockerfile'
```

**NestJS** .env:
```
    DATABASE_URL → http://...
    DEFAULT_ADMIN_EMAIL → admin@admin.com
    DEFAULT_ADMIN_PASSWORD → admin123
    JWT_SECRET → Chave_do_jwt
```

## Vídeo explicativo
**Duração**: 2:43 minutos
**Link**: `https://www.youtube.com/watch?v=hI4CWn0ej8Q`

---

## Checklist do projeto
* Python coleta dados de clima
* Python envia dados para Redis
* Worker Go consome fila e envia para NestJS
* NestJS armazena logs de clima em MongoDB
* NestJS expõe endpoints para listar dados e gerar insights
* Exportação CSV/XLSX funcional
* CRUD de usuários + autenticação JWT
* Frontend React + Vite + Tailwind + shadcn/ui
* Dashboard com gráficos de temperatura e umidade
* Logs detalhados do pipeline
* Docker Compose sobe todos os serviços

---

O projeto demonstra integração de múltiplas linguagens e serviços em uma aplicação moderna, escalável e inteligente — unindo engenharia de dados, backend, frontend e IA aplicada.