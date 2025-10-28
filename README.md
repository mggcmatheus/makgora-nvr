# Makgora NVR - Sistema de Monitoramento por Vídeo

Sistema completo para gerenciamento, visualização e gravação de câmeras RTSP - **100% Go**.

## 🎯 Objetivo

Sistema web para:
- Cadastrar e gerenciar câmeras RTSP
- Visualizar streams em tempo real
- Gravar vídeos localmente
- Fazer backup automático em storage na nuvem

## 🏗️ Arquitetura

```
makgora-nvr/
├── frontend/          # React + TypeScript + Vite
├── backend-go/        # Serviços em Go
│   ├── cmd/
│   │   ├── server/              # API REST (porta 8000)
│   │   └── streaming-service/   # Streaming RTSP → HLS (porta 8001)
│   └── bin/                      # Binários compilados
└── camera_db.sqlite              # Banco de dados SQLite
```

## 🚀 Instalação e Execução

### 1. Backend Go (Compilar)

```bash
cd backend-go
go mod tidy
make build
```

Isso cria `bin/server` e `bin/streaming-service`

### 2. Executar Serviços

Terminal 1 - API Server:
```bash
cd backend-go
./bin/server
```
**Porta:** 8000

Terminal 2 - Streaming Service:
```bash
cd backend-go
./bin/streaming-service
```
**Porta:** 8001

### 3. Frontend

```bash
cd frontend
nvm use 20
yarn install
yarn dev
```

**Porta:** 5173

## ✅ Status do Projeto

- ✅ **Backend**: API REST completa em Go
- ✅ **Frontend**: Interface React com menu lateral
- ✅ **Streaming**: Sistema de streaming em tempo real (Go)
- ⏳ **Gravação**: Gravação local de vídeos
- ⏳ **Cloud Storage**: Upload automático para nuvem
- ⏳ **Dashboard**: Métricas e refinamentos

## 📝 Funcionalidades

### Backend (Go)
- ✅ CRUD completo de câmeras
- ✅ Banco de dados SQLite
- ✅ API REST documentada
- ✅ CORS configurado
- ✅ Performance otimizada

### Frontend (React)
- ✅ Interface moderna e responsiva
- ✅ Menu lateral com Painel e Câmeras
- ✅ Listagem de câmeras
- ✅ Formulário para adicionar câmera
- ✅ Edição e exclusão de câmeras
- ✅ Dashboard com múltiplas câmeras simultâneas
- ✅ Controles de iniciar/parar streams

### Streaming (Go)
- ✅ Conversão RTSP → HLS em tempo real
- ✅ Múltiplos streams simultâneos
- ✅ Gerenciamento automático de processos
- ✅ Configuração otimizada de FFmpeg

## 🔧 Tecnologias

### Backend
- **Go 1.21+** - Linguagem backend
- **Gorilla Mux** - Router HTTP
- **SQLite** - Banco de dados
- **Mattn SQLite3** - Driver SQLite

### Streaming
- **Go** - Serviço de streaming
- **FFmpeg** - Conversão RTSP → HLS
- **HLS** - Protocolo de streaming

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento

## 💾 Performance

| Serviço | Memória | Tempo Resposta |
|---------|---------|----------------|
| Backend Go | ~20 MB | < 1ms |
| Streaming Go | ~50 MB | < 2s |
| Frontend | ~100 MB | Instantâneo |
| **Total** | **~170 MB** | **Excelente** |

## 🎯 Endpoints da API

### Backend (porta 8000)
```
GET    /api/cameras      # Listar câmeras
GET    /api/cameras/{id} # Buscar câmera
POST   /api/cameras      # Criar câmera
PUT    /api/cameras/{id} # Atualizar câmera
DELETE /api/cameras/{id} # Deletar câmera
GET    /health           # Health check
```

### Streaming (porta 8001)
```
POST /api/stream/start/{id} # Iniciar stream
POST /api/stream/stop/{id}  # Parar stream
GET  /api/stream/status/{id} # Status do stream
GET  /api/stream/active      # Streams ativos
GET  /health                 # Health check
GET  /streams/...           # Arquivos HLS
```

## 📖 Documentação

- [Início Rápido](INICIO_RAPIDO.md)
- [Arquitetura](.architetura.md)
- [Teste Migração](TESTE_MIGRACAO_GO.md)

## 🔒 Segurança

⚠️ **Nota:** Esta é uma implementação de desenvolvimento. Para produção:
- Implementar autenticação JWT
- Criptografar senhas no banco
- Usar HTTPS
- Implementar rate limiting
- Validar inputs rigorosamente

## 📄 Licença

Desenvolvido para uso pessoal.
