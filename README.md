# Work Time Tracker - Frontend Client

This repository contains the React + TypeScript + Vite frontend client for the Work Time Tracker application.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v26.x` or later
- **npm**: `v11.x` or later
- **Backend API**: The backend server should be running on `http://localhost:8080`

### 1. Installation

Install project dependencies from the root directory:

```bash
npm install
```

### 2. Development Server

Start the local development server:

```bash
npm run dev
```

The application will be served locally at `http://localhost:5173`.

---

## 🛠 Project Configurations

### Vite Proxy

A development proxy is configured in [vite.config.ts](vite.config.ts) to forward all requests starting with `/api` directly to the backend API:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

### Styling Guidelines

The application strictly utilizes **Vanilla CSS** (without external frameworks like Tailwind or Bootstrap) to support a premium, dark-mode-first aesthetic (see [global.css](src/styles/global.css) and [SignupForm.css](src/components/SignupForm.css)).

---

## 📂 Directory Layout

```text
work-time-tracker-frontend/
├── src/
│   ├── assets/         # Static assets (images, logos)
│   ├── components/     # Reusable UI elements (SignupForm)
│   ├── pages/          # Full page containers (SignupPage)
│   ├── services/       # Service layer classes (api.ts fetch client)
│   ├── styles/         # Global variables, themes, resets (global.css)
│   ├── App.tsx         # Routing and layout framework
│   └── main.tsx        # Vite client entrypoint
├── vite.config.ts      # Vite configuration & API proxy
└── package.json        # Dependencies & scripts
```
