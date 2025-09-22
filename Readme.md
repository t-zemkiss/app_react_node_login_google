# 🚀 App Login de Google y MySQL Frontend React + Backend Node.js con 

Este proyecto permite autenticar usuarios usando **Google Identity Services** y guardar sus datos en **MySQL**. La autenticación se maneja mediante **JWT**, eliminando la necesidad de sesiones tradicionales.

---

## 🛠 Tecnologías Backend

- **Node.js v20 LTS**  
- **Express**  
- **MySQL**  
- **Google Identity Services** (`google-auth-library`)  
- **JWT** (`jsonwebtoken`)  
- **Bcrypt** (`bcryptjs`) 
- **dotenv, cors, body-parser**

---

## ⚡ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/t-zemkiss/app_react_node_login_google
cd backend
```

2. Instalar dependencias backend:

```bash
cd backend 
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto:

```env
GOOGLE_CLIENT_ID=tu_google_client_id
JWT_SECRET=un_secreto_super_seguro
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mi_base_de_datos
```

4. Configurar la base de datos MySQL:

```sql
CREATE DATABASE mi_base_de_datos;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  avatar VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Uso

### Iniciar el servidor

```bash
node server.js
```

El backend estará corriendo en `http://localhost:3000`.

### Endpoints

| Método | Ruta          | Descripción                    |
|--------|---------------|--------------------------------|
| POST   | /auth/google  | Login con Google (`id_token`)  |

**Ejemplo de request:**

```json
POST /auth/google
Content-Type: application/json

{
  "token": "id_token_de_google"
}
```

**Ejemplo de response:**

```json
{
  "token": "jwt_token",
  "user": {
    "sub": "google_user_id",
    "email": "usuario@gmail.com",
    "name": "Nombre Usuario",
    "picture": "url_avatar"
  }
}
```

---

## 📝 Notas

- Se recomienda usar **Node.js v20 LTS** y **npm 11+**.  
- JWT tiene expiración de **7 días**, configurable en `server.js`.  
- Se puede extender para login local con email y contraseña usando `bcryptjs`.  

---

## 🔗 Recursos

- [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Para generar el `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.  
- [MySQL Documentation](https://dev.mysql.com/doc/) → Para gestión de base de datos.  
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library) → Librería oficial de Google para Node.js.