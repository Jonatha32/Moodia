# 🚀 Deploy Moodia a GitHub Pages

## Pasos para el deploy:

### 1. Crear repositorio en GitHub
```bash
# Inicializar git (si no está inicializado)
git init

# Agregar archivos
git add .
git commit -m "Initial commit - Moodia App"

# Conectar con GitHub (reemplaza 'username' con tu usuario)
git remote add origin https://github.com/username/Moodia-5.git
git branch -M main
git push -u origin main
```

### 2. Configurar variables de entorno en GitHub
Ve a tu repositorio → Settings → Secrets and variables → Actions

Agrega estos secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

### 3. Habilitar GitHub Pages
1. Ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)

### 4. Actualizar configuración
En `vite.config.ts`, cambia:
```typescript
base: '/Moodia-5/', // Reemplaza con el nombre de tu repo
```

En `package.json`, actualiza:
```json
"homepage": "https://tu-usuario.github.io/Moodia-5"
```

### 5. Deploy automático
Cada push a `main` desplegará automáticamente a GitHub Pages.

### 6. Configurar Firebase para GitHub Pages
En Firebase Console → Authentication → Settings → Authorized domains:
- Agrega: `tu-usuario.github.io`

En Firebase Console → Hosting (si usas):
- Configura redirects para SPA

## 🌐 URL final
Tu app estará disponible en:
`https://tu-usuario.github.io/Moodia-5`

## 🔧 Deploy manual (opcional)
```bash
npm run build
npm run deploy
```

## ⚠️ Notas importantes
- Las variables de entorno deben estar configuradas en GitHub Secrets
- Firebase debe permitir el dominio de GitHub Pages
- Cloudinary debe permitir el dominio de GitHub Pages
- El primer deploy puede tardar unos minutos