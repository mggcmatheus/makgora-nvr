# Makgora NVR - Frontend

Interface web moderna para gerenciamento de câmeras RTSP.

## 🚀 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento
- **CSS3** - Estilização moderna

## 📦 Instalação

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev
```

A aplicação estará disponível em: http://localhost:5173

## 🎨 Funcionalidades

- ✅ Listar todas as câmeras cadastradas
- ✅ Adicionar nova câmera
- ✅ Editar câmera existente
- ✅ Excluir câmera
- ✅ Visualizar detalhes da câmera
- ✅ Exibir URL RTSP completa
- ✅ Status ativo/inativo

## 🏗️ Estrutura

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── CameraCard.tsx   # Card de câmera
│   │   └── CameraForm.tsx   # Formulário de câmera
│   ├── pages/               # Páginas
│   │   └── CameraList.tsx    # Lista de câmeras
│   ├── services/            # Serviços de API
│   │   └── api.ts           # Cliente HTTP
│   ├── types/               # Tipos TypeScript
│   │   └── camera.ts        # Tipos de câmera
│   ├── App.tsx              # App principal
│   └── main.tsx             # Entry point
├── public/                  # Arquivos estáticos
└── vite.config.ts           # Configuração Vite
```

## 🔧 Configuração

### Proxy para API

O Vite está configurado com proxy para o backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

Isso permite que você faça requisições para `/api/cameras` e elas serão automaticamente redirecionadas para `http://localhost:8000/api/cameras`.

## 📱 Responsividade

A interface é totalmente responsiva e adapta-se a diferentes tamanhos de tela:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Próximas Etapas

- Etapa 3: Streaming RTSP em tempo real
- Etapa 4: Gravação local de vídeos
- Etapa 5: Upload para cloud storage
- Etapa 6: Dashboard com métricas
