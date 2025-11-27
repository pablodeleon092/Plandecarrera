# Plandecarrera

Sistema de gestión académica para la universidad de Tierra Del Fuego que permite administrar docentes, carreras, materias, comisiones y asignaciones de enseñanza.

## Tecnologías

### Backend
- **Laravel** - Framework PHP
- **PostgreSQL 16** - Base de datos relacional
- **Laravel Breeze** - Autenticación
- **Spatie Permissions** - Control de acceso basado en roles
- **PHP 8.2+** - Versión requerida

### Frontend
- **React 18.2** - Librería UI
- **Inertia.js 2.2** - Adaptador SPA Laravel-React
- **Tailwind CSS 3.2** - Framework CSS
- **Headless UI** - Componentes accesibles
- **Vite 7.0** - Build tool y dev server

## Requisitos

- Docker
- Docker Compose


## Instalación

El proyecto incluye una configuración completa de Docker con los siguientes servicios:
- **app**: Contenedor PHP con Laravel
- **web**: Servidor Nginx
- **db**: PostgreSQL 16
- **node**: Servidor de desarrollo Vite

### Pasos de instalación

1.  **Clonar el repositorio**
    ```bash
    git clone [https://github.com/pablodeleon092/Plandecarrera.git](https://github.com/pablodeleon092/Plandecarrera.git)
    cd Plandecarrera
    ```
2.  **Configurar variables de entorno**
    ```bash
    cp .env.example .env
    ```
3.  **Configurar variables de usuario (para permisos de archivos)**
    ```bash
    export MY_UID=$(id -u)
    export MY_GID=$(id -g)
    ```
4.  **Configurar base de datos en `.env` para Docker**
    ```ini
    DB_CONNECTION=pgsql
    DB_HOST=db
    DB_PORT=5432
    DB_DATABASE=laravel
    DB_USERNAME=laravel
    DB_PASSWORD=secret
    ```
5.  **Levantar los contenedores**
    ```bash
    docker-compose up -d
    ```
6.  **Instalar dependencias PHP**
    ```bash
    docker-compose exec app composer install
    ```
7.  **Generar key de aplicación**
    ```bash
    docker-compose exec app php artisan key:generate
    ```
8.  **Ejecutar migraciones**
    ```bash
    docker-compose exec app php artisan migrate
    ```
9.  **Poblar la base de datos con datos iniciales**
    ```bash
    docker-compose exec app php artisan db:seed
    ```
    Este comando ejecutará todos los seeders disponibles:
    - `DocenteSeeder` - Crea 100 docentes de prueba
    - `DedicacionesSeeder` - Carga tipos de dedicación (Simple, SemiExclusiva, Exclusiva)
    - `FuncionAulicaSeeder` - Carga funciones áulicas (teórica, práctica, teórica/práctica)
    - Seeders de carreras por instituto (ICPA, ICSE, IDEI, IEC)

10. **Acceder a la aplicación**
    - Frontend: `http://localhost:8000`
    - Base de datos: `localhost:5432`
    - Vite dev server: `http://localhost:5173`
   
## Funcionalidades

- Gestión de docentes con cargos y dedicaciones
- Administración de carreras y materias
- Creación de comisiones
- Asignación de docentes a comisiones
- Control de carga horaria docente
- Sistema de roles y permisos
- Interfaz SPA con React

## Estructura del Proyecto 
Plandecarrera/  
├── app/  
│   ├── Http/Controllers/    # Controladores Laravel  
│   └── Models/              # Modelos Eloquent  
├── database/  
│   ├── migrations/          # Esquema de base de datos  
│   ├── seeders/             # Datos iniciales  
│   └── factories/           # Factories para testing  
├── resources/  
│   ├── js/  
│   │   ├── Pages/          # Páginas Inertia.js  
│   │   └── Components/     # Componentes React  
│   └── views/              # Templates Blade  
├── routes/  
│   └── web.php             # Definición de rutas  
├── docker-compose.yml      # Configuración Docker  
└── vite.config.js          # Configuración Vite  
## Licencia

definir!


### Comandos útiles de Docker

```bash
# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Detener contenedores
docker-compose down

# Reiniciar contenedores
docker-compose restart

# Ejecutar comandos artisan
docker-compose exec app php artisan [comando]

# Acceder al contenedor
docker-compose exec app bash

# Limpiar y reconstruir
docker-compose down -v
docker-compose up -d --build
