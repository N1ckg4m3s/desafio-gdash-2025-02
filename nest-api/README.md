# Nest Api

## Resumo
Backend central da aplicação, construído com NestJS + MongoDB, responsável por:
* Receber e armazenar dados meteorológicos enviados pelo Go Worker
* Gerar insights de IA a partir dos dados do dia
* Gerenciar usuários (CRUD com roles admin/user e autenticação JWT)
* Exportar dados em CSV/XLSX
**Observação**: Este serviço só funciona integrado via Docker Compose. Não há execução local independente.

---

## Subindo o serviço
Para iniciar o React Dashboard junto com todos os serviços necessários, utilize o Docker Compose a partir da raiz do projeto:
``` bash
  docker compose up nest-api
```
Isso garante que o frontend consiga se comunicar corretamente com a API NestJS, Redis, MongoDB e os workers.

Para subir todos os serviços da aplicação de uma vez:
``` bash
  docker compose up --build
```

---

## URLs de acesso
**Frontend**: http://localhost:3000

Endpoints principais
* **POST**  | /weather → salvar log de clima
* **GET**   | /weather → listar logs
* **GET**   | /weather/list → histórico detalhado
* **GET**   | /weather/insights → gerar insights de IA
* **GET**   | /weather/export.csv → exportar CSV
* **GET**   | /weather/export.xlsx → exportar XLSX
* **POST**  | /auth → autenticação

* CRUD de usuários (/users) com roles e acesso restrito via AuthGuard

**Observação**: Usuário padrão é criado automaticamente na inicialização via .env.

---

## No arquivo /nest-api/.env:
```
    DATABASE_URL → URL do MongoDB
    DEFAULT_ADMIN_EMAIL → e-mail do usuário admin inicial
    DEFAULT_ADMIN_PASSWORD → senha do usuário admin inicial
    JWT_SECRET → chave secreta para autenticação JWT
```

---

## Logs

Visualize os logs da API via Docker Compose:
``` bash
    docker compose logs nest-api
```

Os logs incluem:
* Recebimento de dados do Go Worker
* Processamento de insights de IA

---

## Observações
* A API depende do MongoDB e do Redis estarem ativos no Docker Compose
* Todos os endpoints funcionam apenas quando a aplicação completa está rodando
* Este serviço não deve ser executado isoladamente sem os outros componentes