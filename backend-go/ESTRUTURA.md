# 📁 Estrutura do Projeto - Makgora Backend

## 🎯 Organização

```
backend-go/
├── cmd/                      # Aplicações executáveis
│   ├── server/              # API REST (CRUD de câmeras)
│   │   └── main.go          # Entry point do server
│   └── streaming-service/   # Serviço de streaming RTSP → HLS
│       └── main.go          # Entry point do streaming
│
├── internal/                # Código privado (só esse módulo usa)
│   ├── api/                 # Lógica da API REST
│   │   ├── database.go      # Conexão e init do banco
│   │   ├── handlers.go       # Handlers HTTP (GET, POST, PUT, DELETE)
│   │   └── cors.go           # Middleware CORS
│   │
│   ├── models/              # Modelos de dados
│   │   └── camera.go         # Modelo Camera e helpers
│   │
│   └── streaming/            # Lógica de streaming
│       ├── service.go        # Core do streaming (StartStream, StopStream, etc)
│       ├── handlers.go       # Handlers HTTP para streaming
│       └── middleware.go     # Middlewares CORS e HLS
│
├── pkg/                     # Código público (futuros módulos externos)
│
├── bin/                     # Binários compilados
│   ├── server
│   └── streaming-service
│
├── go.mod
├── go.sum
└── README.md
```

## 🧩 Módulos

### `internal/api/` - API REST
- **database.go**: Conexão SQLite e criação de tabelas
- **handlers.go**: Endpoints GET, POST, PUT, DELETE
- **cors.go**: Middleware para permitir requests do frontend

### `internal/models/` - Modelos de Dados
- **camera.go**: Structs `Camera` e `CameraCreate`, helpers para RTSP URL

### `internal/streaming/` - Streaming RTSP
- **service.go**: Gerenciamento de streams (FFmpeg)
- **handlers.go**: Endpoints para iniciar/parar streams
- **middleware.go**: CORS e headers para HLS

### `cmd/` - Entry Points
- **server/main.go**: Servidor HTTP na porta 8000
- **streaming-service/main.go**: Servidor HTTP na porta 8001

## 🚀 Benefícios da Estrutura

### ✅ Separação de Responsabilidades
- Cada módulo tem uma função clara
- Fácil localizar código específico

### ✅ Reutilização
- `models/` pode ser usado por `api/` e `streaming/`
- `internal/` evita importação externa indevida

### ✅ Escalabilidade
- Fácil adicionar novos módulos (`pkg/`)
- `internal/` cresce conforme necessário

### ✅ Manutenibilidade
- Código organizado e modular
- Mudanças isoladas por módulo

## 📝 Convenções Go

- **`internal/`**: Código privado do projeto
- **`pkg/`**: Código público reutilizável
- **`cmd/`**: Aplicações executáveis com `main()`
- **`bin/`**: Binários compilados (gitignore)

## 🔄 Fluxo de Dados

```
Frontend → cmd/server → internal/api/handlers → internal/models → database
Frontend → cmd/streaming-service → internal/streaming/handlers → FFmpeg
```

## 🎯 Próximos Passos

1. Adicionar `internal/database/` para migrations
2. Adicionar `internal/config/` para configurações
3. Adicionar `pkg/errors/` para error handling centralizado
4. Adicionar testes em cada módulo

