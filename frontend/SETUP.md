# Setup do Frontend

## 📋 Requisitos

- **Node.js**: 20.x
- **Yarn**: 1.22+

## 🚀 Como Iniciar

### 1. Ativar Node.js 20 com nvm

```bash
nvm use 20
```

Ou use o arquivo `.nvmrc`:

```bash
nvm use  # vai usar a versão 20 especificada no .nvmrc
```

### 2. Instalar Dependências

```bash
yarn install
```

### 3. Executar Servidor de Desenvolvimento

```bash
yarn dev
```

O frontend estará disponível em: **http://localhost:5173**

## 🔧 Verificar Versões

```bash
node --version  # Deve retornar v20.x.x
yarn --version  # Deve retornar 1.22+
```

## 🐛 Troubleshooting

### Erro: "This package doesn't seem to be present in your lockfile"

```bash
rm -rf node_modules
yarn install
```

### Erro de importação de módulos

```bash
rm -rf node_modules/.vite
yarn dev
```

### Mudar versão do Node

```bash
nvm install 20
nvm use 20
```

