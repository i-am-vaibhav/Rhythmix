# Rhythmix

**Rhythmix** is a modern and intuitive web-based music player application designed to provide a seamless music listening experience. With a sleek interface and powerful features, Rhythmix lets you enjoy your favorite tracks anytime, anywhere.

---

## 🚀 Overview

This guide explains how to manually build and run each microservice and frontend of Rhythmix on macOS, Linux, and Windows machines (PowerShell or Command Prompt). It also includes a reference Docker Compose file for an automated setup.

---

## 💻 Cross-Platform Compatibility

- **macOS & Linux**: Use Bash or Zsh terminals. Set environment variables with `export`.
- **Windows (PowerShell)**: Use PowerShell. Set environment variables with `$Env:VAR = 'value'`.
- **Windows (Command Prompt)**: Use `set VAR=value`.

Commands below are grouped by OS where syntax differs.

---

## 🛠 Prerequisites

- **Java 17+** (for Spring Boot services)
- **Maven & Dotnet@8** (for building backend services)
- **Node.js 16+ & npm** (for building frontends)
- **PostgreSQL 14+** (local or Docker)
- **Git**
- **Optional**: Docker & Docker Compose (for DB or full automated setup)

---

## 🗄️ Database Setup

### Local PostgreSQL

1. Install PostgreSQL.
2. Create database and user:

   **macOS/Linux (psql):**

   ```bash
   psql -U postgres
   CREATE DATABASE rhythmix;
   CREATE USER rhythmix WITH PASSWORD 'rhythmix';
   GRANT ALL PRIVILEGES ON DATABASE rhythmix TO rhythmix;
   ```

   **Windows (PowerShell):**

   ```powershell
   psql -U postgres
   CREATE DATABASE rhythmix;
   CREATE USER rhythmix WITH PASSWORD 'rhythmix';
   GRANT ALL PRIVILEGES ON DATABASE rhythmix TO rhythmix;
   ```

3. Ensure JDBC URL points to `jdbc:postgresql://localhost:5432/rhythmix`.

---

## 🏗️ Build & Run Backend Services

Maven, Dotnet is required to build backend services:

```bash
brew install maven

brew install dotnet@8
```

Services live under `backend/`:

```
backend/
├── rhythmix-config-server
├── rhythmix-auth-service
├── rhythmix-gateway
├── rhythmix-song-service
└── rhythmix-user-services
```

### 1. Config Server

**macOS/Linux**

```bash
cd backend/rhythmix-config-server
mvn clean package -DskipTests
java -jar target/*.jar --server.port=8888
```

**Windows (PowerShell)**

```powershell
cd backend\rhythmix-config-server
mvn clean package -DskipTests
java -jar target\*.jar --server.port=8888
```

_Health endpoint: http://localhost:8888/actuator/health_

### 2. Auth Service

**macOS/Linux**

```bash
cd backend/rhythmix-auth-service
mvn clean package -DskipTests
export CONFIG_SERVER_URL=http://localhost:8888
export SPRING_PROFILES_ACTIVE=dev
export USER_SERVICE_BASE_URL=http://localhost:8080
java -jar target/*.jar --server.port=8100
```

**Windows (PowerShell)**

```powershell
cd backend\rhythmix-auth-service
mvn clean package -DskipTests
$Env:CONFIG_SERVER_URL = 'http://localhost:8888'
$Env:SPRING_PROFILES_ACTIVE = 'dev'
$Env:USER_SERVICE_BASE_URL = 'http://localhost:8080'
java -jar target\*.jar --server.port=8100
```

### 3. User Service

**macOS/Linux**

```bash
cd backend/rhythmix-user-services
dotnet restore
dotnet publish -c Release -o out
export SPRING__CLOUD__CONFIG__URI=http://localhost:8888
export SPRING__PROFILES__ACTIVE=Local
export ASPNETCORE_ENVIRONMENT=Local
dotnet out/rhythmix_user_services.dll "--urls=http://*:8080"
```

**Windows (PowerShell)**

```powershell
cd backend\rhythmix-user-services
dotnet restore
dotnet publish -c Release -o out
$Env:SPRING__CLOUD__CONFIG__URI= 'http://localhost:8888'
$Env:SPRING__PROFILES__ACTIVE= 'Local'
$Env:ASPNETCORE_ENVIRONMENT= 'Local'
dotnet out/rhythmix_user_services.dll --urls=http://*:8080
```

### 4. Song Service

**macOS/Linux**

```bash
cd backend/rhythmix-song-service
mvn clean package -DskipTests
export CONFIG_SERVER_URL=http://localhost:8888
export SPRING_PROFILES_ACTIVE=dev
export POSTGRES_JDBC_URL=jdbc:postgresql://localhost:5432/rhythmix
java -jar target/*.jar --server.port=8200
```

**Windows (PowerShell)**

```powershell
cd backend\rhythmix-song-service
mvn clean package -DskipTests
$Env:CONFIG_SERVER_URL = 'http://localhost:8888'
$Env:SPRING_PROFILES_ACTIVE = 'dev'
$Env:POSTGRES_JDBC_URL = 'jdbc:postgresql://localhost:5432/rhythmix'
java -jar target\*.jar --server.port=8200
```

### 5. Gateway (Routing)

**macOS/Linux**

```bash
cd backend/rhythmix-gateway
mvn clean package -DskipTests
export CONFIG_SERVER_URL=http://localhost:8888
export SPRING_PROFILES_ACTIVE=dev
export rhythmix_auth_service_url=http://localhost:8100
export rhythmix_user_service_url=http://localhost:8080
export rhythmix_song_service_url=http://localhost:8200
export AUTH_SERVICE_BASE_URL=http://localhost:8100/auth
export FRONTEND_URL=http://localhost:5173
java -jar target/*.jar --server.port=8761
```

**Windows (PowerShell)**

```powershell
cd backend\rhythmix-gateway
mvn clean package -DskipTests
$Env:CONFIG_SERVER_URL = 'http://localhost:8888'
$Env:SPRING_PROFILES_ACTIVE = 'dev'
$Env:rhythmix_auth_service_url = 'http://localhost:8100'
$Env:rhythmix_user_service_url = 'http://localhost:8080'
$Env:rhythmix_song_service_url = 'http://localhost:8200'
$Env:AUTH_SERVICE_BASE_URL = 'http://localhost:8100/auth'
$Env:FRONTEND_URL = 'http://localhost:5173'
java -jar target\*.jar --server.port=8761
```

---

## 📱 Build & Run Frontend Apps

Services live under `frontend/`:

```
frontend/
├── rhythmix-home-web
├── rhythmix-library-web
├── rhythmix-player-web
└── rhythmix-web
```

For each app, replace `<folder>` and `<port>` accordingly:

**macOS/Linux**

```bash
cd frontend/<folder>
npm install
npm run build
npx serve -s dist -l <port>
```

**Windows (PowerShell)**

```powershell
cd frontend\<folder>
npm install
npm run build
npx serve -s dist -l <port>
```

| App               | Folder                 | Port |
| ----------------- | ---------------------- | ---- |
| Home Web          | `rhythmix-home-web`    | 3002 |
| Library Web       | `rhythmix-library-web` | 3001 |
| Player Web        | `rhythmix-player-web`  | 3000 |
| Main Portal (Web) | `rhythmix-web`         | 5173 |

---

## 🎛️ Environment Variables Summary

**Backend services** (set via `export` or PowerShell `$Env`):

- `CONFIG_SERVER_URL`
- `SPRING_PROFILES_ACTIVE`
- `POSTGRES_JDBC_URL` (user & song services)
- `USER_SERVICE_BASE_URL` (auth)
- `AUTH_SERVICE_BASE_URL`, `USER_SERVICE_BASE_URL`, `SONG_SERVICE_BASE_URL` (gateway)
- `FRONTEND_URL` (gateway)

**Frontends** default to `NODE_ENV=production`.

---

## 📦 (Optional) Docker Compose Reference

Use the `docker-compose.yml` present in root directory to quickly spin up all services and dependencies:

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, build and test locally, then submit a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or feedback: [vgworks566556@gmail.com](mailto:vgworks566556@gmail.com)
