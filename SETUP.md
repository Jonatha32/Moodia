# Moodia MVP - Guía de Instalación

## 🚀 Configuración del Proyecto

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Expo CLI (para móvil): `npm install -g @expo/cli`

### 1. Configuración Web (Next.js)

```bash
cd moodia-web
npm install
```

#### Configurar Firebase
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Google/Email)
3. Crear Firestore Database
4. Configurar Storage
5. Copiar `.env.local.example` a `.env.local` y completar variables

#### Ejecutar aplicación web
```bash
npm run dev
```
Abrir http://localhost:3000

### 2. Configuración Móvil (React Native)

```bash
cd moodia-mobile
npm install
```

#### Ejecutar aplicación móvil
```bash
npm start
```

Usar Expo Go app para probar en dispositivo o emulador.

## 📱 Funcionalidades MVP Implementadas

### ✅ Completadas
- **Selector de Mood diario**: 7 opciones emocionales con nueva paleta
- **Feed filtrado por mood**: Muestra contenido relevante
- **Sistema de reacciones**: 6 tipos de reacciones emocionales
- **Publicación básica**: Título, descripción, mood, contexto
- **Interfaz responsive**: Web y móvil
- **Identidad visual Moodia**: Logo integrado, gradientes, tipografías
- **Diseño actualizado**: Colores por mood, bordes redondeados, sombras suaves

### 🔄 Pendientes para producción
- Integración completa con Firebase
- Autenticación de usuarios
- Subida de imágenes
- Perfil de usuario completo
- Persistencia de datos
- Notificaciones push (móvil)

## 🎨 Estructura del Proyecto

### Web (Next.js)
```
moodia-web/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── lib/                # Configuración Firebase
├── types/              # Tipos TypeScript
└── public/             # Assets estáticos
```

### Móvil (React Native)
```
moodia-mobile/
├── src/
│   ├── components/     # Componentes UI
│   ├── screens/        # Pantallas principales
│   ├── types/          # Tipos TypeScript
│   └── services/       # APIs y servicios
└── assets/             # Imágenes y recursos
```

## 🔧 Próximos Pasos

1. **Configurar Firebase completamente**
2. **Implementar autenticación**
3. **Agregar subida de imágenes**
4. **Crear sistema de perfiles**
5. **Implementar guardado de posts**
6. **Agregar navegación completa (móvil)**
7. **Optimizar animaciones y transiciones**
8. **Implementar modo oscuro con paleta Moodia**

## 🌟 Características Únicas de Moodia

- **Sin likes tradicionales**: Sistema de reacciones emocionales
- **Filtrado por mood**: Contenido personalizado según estado emocional
- **Enfoque en procesos**: No en resultados finales
- **Diseño consciente**: Sin scroll infinito ni notificaciones adictivas
- **Autenticidad**: Contexto emocional en cada publicación
- **Identidad visual única**: Gradientes purple-pink, tipografía Poppins/Inter
- **Experiencia emocional**: Colores adaptativos según mood del usuario

## 🎨 Identidad Visual Implementada

### Colores Principales
- **Primary Purple**: #7B5BFF (botones, gradientes)
- **Primary Pink**: #FF5E9C (acentos, hover states)
- **Primary Orange**: #FFAB5E (highlights)

### Colores por Mood
- **Focus**: #3A86FF (azul concentración)
- **Creativo**: #FF5E9C (fucsia creatividad)
- **Explorador**: #00C897 (verde descubrimiento)
- **Reflexivo**: #9B5DE5 (violeta contemplación)
- **Chill**: #70D6FF (celeste relajación)
- **Relax**: #D3D3E7 (gris suave)
- **Motivado**: #FF6B6B (rojo energía)

### Tipografías
- **Headers**: Poppins (moderna, redondeada)
- **Body**: Inter (limpia, legible)

### Elementos de Diseño
- **Bordes**: Redondeados (20px)
- **Sombras**: Suaves y difusas
- **Gradientes**: Purple → Pink
- **Animaciones**: Fluidas con Framer Motion