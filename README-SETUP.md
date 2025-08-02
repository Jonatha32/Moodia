# 🚀 Configuración Inicial de Moodia

## 📋 Pasos para configurar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto llamado "moodia"
3. Habilita Authentication (Email/Password)
4. Crea una base de datos Firestore (modo prueba)
5. Configura Storage
6. Ve a Configuración del proyecto > General > Tus apps
7. Copia la configuración de Firebase

### 3. Variables de entorno

1. Copia `.env.example` a `.env`:

```bash
copy .env.example .env
```

2. Completa las variables con tu configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Configurar Firebase CLI (para hosting)

```bash
npm install --save-dev firebase-tools
```

> **Nota:** Se recomienda instalar `firebase-tools` como una dependencia de desarrollo para asegurar que todos los colaboradores usen la misma versión. Los comandos se pueden ejecutar con `npx firebase <comando>`.

```bash
firebase login
firebase init
```

Selecciona:

- Hosting
- Firestore
- Storage

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

### 6. Construir para producción

```bash
npm run build
```

### 7. Desplegar a Firebase Hosting

```bash
firebase deploy
```

## 🎯 Funcionalidades implementadas

- ✅ Autenticación con Firebase Auth
- ✅ Estructura de componentes React
- ✅ Contexto de autenticación
- ✅ Rutas protegidas
- ✅ Diseño con Tailwind CSS
- ✅ Configuración de Firebase
- ✅ Tipos TypeScript
- ✅ Selector de mood básico

## 📁 Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── services/      # Configuración Firebase
├── contexts/      # Contextos React
├── types/         # Tipos TypeScript
└── assets/        # Recursos estáticos
```

## 🔧 Próximos pasos

1. Implementar creación de posts
2. Agregar sistema de reacciones
3. Implementar subida de imágenes
4. Crear feed filtrado por mood
5. Agregar perfil de usuario
