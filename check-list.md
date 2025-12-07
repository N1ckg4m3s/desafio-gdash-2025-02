# Check list do projeto

## Resume

Numero de tarefas: 78

Concluidas =  72    [~86.8%]
Em espera = 05      [~12.0%]
Resolvendo = 1      [~01.2%]

## [x] Fase 0 — Infra & Docker
- [x] Criar docker-compose.yml com todos os serviços (MongoDB, Redis, NestJS, Python, Go, Frontend).
- - [x] python-service.
- - [x] go-worker.
- - [x] nest-api.
- - [x] react-dashboard.
- [x] Garantir comunicação via nomes de serviços (redis, nest-api).
- [x] Configurar .env e .env.example.
- [x] Criar .dockerignore e otimizar builds.
- [x] Testar docker compose up --build do zero.
- - [x] python-service.
- - [x] go-worker.
- - [x] nest-api.
- - [x] react-dashboard.

## [x] Fase 1 — Python (produtor de dados)
- [x] Criar script que coleta dados do Open-Meteo.
- [x] Normalizar JSON (temperatura, umidade, vento, etc).
- [x] Conectar com Redis/RabbitMQ e enviar mensagens.
- [x] Tratar erros de rede e API.
- [x] Testar envio manual: verificar se mensagens chegam à fila.

## [x] Fase 2 — Go (worker consumidor)
- [x] Conectar ao broker e criar consumer group se necessário.
- [x] Ler mensagens da fila, parse JSON com validação mínima.
- [x] Enviar para NestJS via POST.
- [x] Implementar ACK/NACK + retry básico (3x).
- [x] Logs de sucesso e falha.
- [x] Testar pipeline Python → Go → NestJS (mensagem aparece na API).

## [x] Fase 3 — NestJS + MongoDB
- [x] Configurar MongoDB + Prisma/Mongoose.
- [x] Criar endpoint POST /weather para receber dados.
- [x] Salvar dados no MongoDB.
- [x] Criar GET /weather para listar.
- [x] Criar CSV/XLSX export.
- [x] Criar insights simples (ex.: média, min, max).
- [x] CRUD de usuários + autenticação JWT.
- [x] Criar usuário padrão via seed ou inicialização.
- [x] Adicionar respostas melhores.
- [x] Teste ponta a ponta: Python → Go → Nest → MongoDB.

## [x] Fase 4 — Frontend React + Vite
- [x] Criar layout básico com Tailwind + shadcn/ui.
- [x] Página Dashboard:
- - [x] Listagem de clima.
- - [x] Cards de temperatura, umidade, vento.
- - [x] Botões export CSV/XLSX.
- [x] Página Users:
- - [x] Criar tabela listando usuários
- - [x] Botoes:
- - - [x] Adicionar
- - - [x] Remover
- - - [x] Atualizar
- - [x] Formulario
- - - [x] Email
- - - [x] Senha
- - - [x] Role
- [x] Mostrar insights básicos da API.
- [x] Tela de login e CRUD de usuários.
- [x] Testar integração com NestJS.
- [x] Adicionar Feedback visual:
- - [x] Loading 
- - [x] Erro
- - [x] Aviso

## [x] Fase 5 — Pipeline completo
- [x] Rodar tudo via Docker Compose.
- [x] Verificar logs e mensagens fluindo corretamente: Python → Go → Nest → Mongo → Frontend.
- [x] Garantir erros tratados em cada serviço.
- [x] Refinar insights IA (texto, alertas).

## [-] Fase 6 — Polimento & entrega
- [x] README completo:
- - [x] Como rodar tudo via Docker Compose.
- - [x] Como rodar Python e Go manualmente.
- - [x] URLs principais, usuário padrão.
- [x] .env.example atualizado.
- [] Vídeo de até 5 minutos mostrando:
- - [] Arquitetura geral.
- - [] Pipeline funcionando.
- - [] Insights IA.
- [] Verificar branch e Pull Request nomeada corretamente.
- [x] Testes finais: rebuild do zero, tudo rodando sem intervenção manual.