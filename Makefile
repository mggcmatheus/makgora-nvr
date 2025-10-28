.PHONY: build run clean

# Compilar ambos os serviços
build:
	cd backend-go && go build -o bin/server ./cmd/server
	cd backend-go && go build -o bin/streaming-service ./cmd/streaming-service

# Executar servidor API
run-server:
	cd backend-go && ./bin/server

# Executar serviço de streaming
run-streaming:
	cd backend-go && ./bin/streaming-service

# Instalar dependências do frontend
install-frontend:
	cd frontend && yarn install

# Executar frontend
run-frontend:
	cd frontend && yarn dev

# Compilar e executar tudo
run: build
	@echo "✅ Compilação concluída!"
	@echo ""
	@echo "Para executar, use em terminais separados:"
	@echo "  Terminal 1: make run-server"
	@echo "  Terminal 2: make run-streaming"

# Limpar binários
clean:
	rm -rf backend-go/bin backend-go/*.sqlite

# Executar testes (se houver)
test:
	cd backend-go && go test ./...

# Atualizar dependências
deps:
	cd backend-go && go mod tidy

