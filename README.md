# Bitácora de Riego de Plantas

Aplicación web para registrar plantas y su historial de riegos, calcular cuándo toca el próximo riego y detectar qué plantas están atrasadas. Backend API REST en Laravel (Sanctum) y frontend en React (Vite + React Router + shadcn/ui).

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Laravel 13, Eloquent, Laravel Sanctum |
| Frontend | React 19, Vite, React Router, shadcn/ui, Tailwind CSS v4 |
| Base de datos | SQLite (por defecto) o MySQL/MariaDB |
| Tests | Pest |

## Requisitos

- PHP >= 8.3 (probado con 8.5)
- Composer 2
- Node >= 20 (probado con 22)
- MySQL/MariaDB si no se usa SQLite

## Instalación

```bash
git clone <url-del-repositorio>
cd endProjectCedia

composer install
npm install

cp .env.example .env
php artisan key:generate
```

### Base de datos

Por defecto `.env.example` usa SQLite, que no requiere ningún servidor extra:

```bash
touch database/database.sqlite
```

Si prefieres MySQL/MariaDB, edita `.env` con tus credenciales:

```env
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=watering
DB_USERNAME=tu_usuario
DB_PASSWORD="tu_contraseña"
```

> Si la contraseña tiene caracteres especiales (`#`, `$`, etc.), ponla entre comillas dobles — sin comillas, dotenv corta el valor en el primer `#`.

Luego corre las migraciones y siembra el catálogo de especies, un usuario de prueba y 25 plantas de ejemplo:

```bash
php artisan migrate --seed
```

### Usuario de prueba

| Email | Contraseña |
|---|---|
| `user@demo.test` | `password` |

## Levantar en desarrollo

```bash
composer run dev
```

Esto levanta en paralelo el servidor de Laravel, el worker de colas, los logs (`pail`) y el servidor de Vite. La app queda en `http://localhost:8000`.

## Tests

```bash
php artisan test          # suite de Pest
composer run lint         # Pint (formato PHP)
composer run types:check  # Larastan (análisis estático)
npm run check             # formato + lint del frontend
npm run types:check       # TypeScript
composer run ci:check     # todo lo anterior, como en CI
```

## Estructura del proyecto

```
app/
  Http/Controllers/   Controllers de la API (Auth, Species, Plant, Watering, Dashboard)
  Http/Requests/       Form Requests (validación)
  Http/Resources/      API Resources (forma de las respuestas JSON)
  Models/               Species, Plant, Watering, User
  Policies/            PlantPolicy (aislamiento por usuario)
  Support/WateringStatus/  Patrón Strategy para calcular estado/próximo riego (ver abajo)
database/
  migrations/, factories/, seeders/
routes/api.php          Rutas de la API (todas bajo auth:sanctum salvo register/login)
resources/js/
  pages/                Páginas de React (Login, Register, Dashboard, PlantsList, PlantDetail, PlantForm)
  components/           Componentes propios (AppLayout, ProtectedRoute, CreatePlantDialog) y ui/ (shadcn)
  hooks/use-auth.tsx    Contexto de autenticación
  lib/api.ts            Cliente fetch con token de Sanctum
tests/
  Feature/              Tests de endpoints, policy y del patrón Strategy
```

## Arquitectura y decisiones de diseño

- **Dato derivado, no almacenado**: `proximo_riego` y `estado` de una planta nunca se guardan en la base de datos; se calculan a partir del último riego registrado, así nunca quedan desincronizados.
- **Patrón Strategy**: ese cálculo vive en `App\Support\WateringStatus`, detrás de la interfaz `WateringStatusStrategy`. La implementación por defecto (`FixedFrequencyWateringStatusStrategy`) es intercambiable — por ejemplo, un régimen de riego automático o un cálculo dependiente del clima podría implementarse como otra estrategia sin tocar el modelo `Plant`. Se resuelve vía el contenedor de Laravel (`AppServiceProvider`).
- **Aislamiento por usuario**: cada acceso a una planta pasa por `PlantPolicy` y el scope `delUsuario`, de modo que un usuario nunca puede leer, editar o borrar plantas ajenas.
- **API independiente del frontend**: el backend expone solo JSON vía `/api/*`; el frontend es una SPA de React que vive en el mismo repositorio por conveniencia de desarrollo, pero no depende de Blade ni de Inertia.
