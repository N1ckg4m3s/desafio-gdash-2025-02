# React Dashboard

## Resumo
Frontend da aplicação, construído com React + Vite + Tailwind + shadcn/ui, responsável por:
* Exibir dados meteorológicos de Carapicuíba coletados pelo pipeline Python → Redis → Go → NestJS
* Mostrar insights de IA gerados pelo NestJS
* Gerenciar usuários (CRUD)
* Exportar dados em CSV/XLSX
**Observação:** Este serviço só funciona integrado via Docker Compose. Não há execução local independente.

---

## Subindo o serviço
Para iniciar o React Dashboard junto com todos os serviços necessários, utilize o Docker Compose a partir da raiz do projeto:
``` bash
  docker compose up react-dashboard
```
Isso garante que o frontend consiga se comunicar corretamente com a API NestJS, Redis, MongoDB e os workers.

Para subir todos os serviços da aplicação de uma vez:
``` bash
  docker compose up --build
```

---

## URLs de acesso
**Frontend**: http://localhost:8080
Rotas internas:
* / → Login
* /dashboard → Dashboard clima + insights
* /users → CRUD de usuários (apenas admin)

---

## Funcionalidades
* Dashboard com gráficos de temperatura e umidade (usando Recharts)
* Exibição de insights de IA (via endpoint /weather/insights do NestJS)
* Exportação de CSV/XLSX integrando com os endpoints do backend
* CRUD de usuários com autenticação e roles (admin/user)

---

## Observações
* Todos os dados são carregados via API NestJS; não há banco local.
* Este serviço depende de todos os outros serviços estarem rodando no Docker Compose para funcionar corretamente.
* Logs de execução podem ser visualizados pelo Docker Compose:
```bash
  docker compose logs react-dashboard
```