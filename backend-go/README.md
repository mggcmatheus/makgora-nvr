# Makgora Backend - Go

Backend unificado em Go com dois serviços separados.

## 🏗️ Estrutura

```
backend-go/
├── cmd/
│   ├── server/              # API REST (CRUD de câmeras)
│   └── streaming-service/   # Streaming RTSP → HLS
├── bin/                     # Binários compilados
└── go.mod
```

## 🚀 Instalação e Compilação

```bash
cd backend-go
go mod tidy
make build
```

Isso compilará:
- `bin/server` - API REST (porta 8000)
- `bin/streaming-service` - Streaming (porta 8001)

## 📦 Executar

### Terminal 1 - API Server
```bash
cd backend-go
./bin/server
```

### Terminal 2 - Streaming Service
```bash
cd backend-go
./bin/streaming-service
```

## 📡 Endpoints

### API Server (8000)
- `GET /api/cameras` - Listar câmeras
- `GET /api/cameras/{id}` - Buscar câmera
- `POST /api/cameras` - Criar câmera
- `PUT /api/cameras/{id}` - Atualizar câmera
- `DELETE /api/cameras/{id}` - Deletar câmera
- `GET /health` - Health check

### Streaming Service (8001)
- `POST /api/stream/start/{id}` - Iniciar stream
- `POST /api/stream/stop/{id}` - Parar stream
- `GET /api/stream/status/{id}` - Status do stream
- `GET /api/stream/active` - Streams ativos
- `GET /health` - Health check
- `GET /streams/...` - Arquivos HLS

## 💾 Banco de Dados

SQLite compartilhado: `camera_db.sqlite` (na raiz do projeto)

## 🎯 Performance

- **Memória total**: ~70 MB (20 MB server + 50 MB streaming)
- **Latência**: < 1ms para API, < 2s para streaming
- **CPU**: Uso mínimo
