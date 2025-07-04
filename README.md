# 🕒 Sistema de Gestión de Horas Extra - CloudNativeAmadeus

## 📑 Índice

- [📋 Descripción General](#-descripción-general)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📊 Modelo de Datos](#-modelo-de-datos)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🧪 Pruebas](#-pruebas)
- [🐳 Docker](#-docker)
- [📱 Funcionalidades del Sistema](#-funcionalidades-del-sistema)
- [🔧 Configuración Avanzada](#-configuración-avanzada)
- [🚨 Troubleshooting](#-troubleshooting)
- [📈 Roadmap](#-roadmap)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [📄 Licencia](#-licencia)
- [🤝 Contribución](#-contribución)
- [📞 Soporte](#-soporte)

---

## 📋 Descripción General

**CloudNativeAmadeus** es un sistema completo de gestión de horas extra desarrollado para la empresa **Amadeus** por el **Grupo 5**. El proyecto implementa una arquitectura moderna con separación de responsabilidades, utilizando tecnologías cloud-native para garantizar escalabilidad, mantenibilidad y robustez.

### 🎯 Objetivos del Sistema

- **Gestión de Horas Extra**: Registro, aprobación y seguimiento de horas extra de empleados
- **Control de Acceso**: Sistema de autenticación y autorización basado en roles
- **Administración**: Panel de administración para gestión de usuarios, departamentos y configuraciones
- **Reportes**: Visualización y análisis de datos de horas extra
- **Interfaz Moderna**: UI/UX intuitiva y responsiva

---

## 🏗️ Arquitectura del Sistema

### 📂 Estructura del Proyecto

```
CloudNativeAmadeus/
├── Client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── api/                     # Configuración de API
│   │   ├── components/              # Componentes reutilizables
│   │   ├── context/                 # Contextos de React
│   │   ├── pages/                   # Páginas de la aplicación
│   │   ├── routes/                  # Configuración de rutas
│   │   ├── store/                   # Estado global (Redux)
│   │   └── styles.css               # Estilos globales
│   ├── public/                      # Archivos estáticos
│   └── package.json                 # Dependencias del frontend
├── ExtraHours.API/                  # API REST (.NET 9)
│   ├── Controllers/                 # Controladores de la API
│   ├── Utils/                       # Utilidades (JWT, etc.)
│   └── Program.cs                   # Configuración de la aplicación
├── ExtraHours.CORE/                 # Lógica de negocio
│   ├── Models/                      # Entidades del dominio
│   ├── Repositories/                # Interfaces de repositorios
│   └── Services/                    # Interfaces de servicios
├── ExtraHours.Infrastructure/       # Capa de infraestructura
│   ├── Data/                        # Contexto de base de datos
│   ├── Repositories/                # Implementación de repositorios
│   ├── Services/                    # Implementación de servicios
│   └── Migrations/                  # Migraciones de Entity Framework
├── ExtraHours.Test/                 # Pruebas unitarias
└── ExtraHourGroup5.sln              # Solución de Visual Studio
```

### 🔄 Patrón de Arquitectura

El sistema sigue el patrón **Clean Architecture** con las siguientes capas:

1. **API Layer** (`ExtraHours.API`): Controladores y configuración de la aplicación
2. **Core Layer** (`ExtraHours.CORE`): Entidades, interfaces y lógica de negocio
3. **Infrastructure Layer** (`ExtraHours.Infrastructure`): Implementación de repositorios y servicios
4. **Presentation Layer** (`Client`): Interfaz de usuario

---

## 🛠️ Stack Tecnológico

### Backend (.NET 9)

- **Framework**: ASP.NET Core 9.0
- **Base de Datos**: PostgreSQL con Entity Framework Core
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI
- **Patrón**: Repository Pattern + Service Layer
- **ORM**: Entity Framework Core 9.0

### Frontend (React)

- **Framework**: React 19.0
- **Build Tool**: Vite 6.2
- **Estado Global**: Redux Toolkit
- **Routing**: React Router DOM 7.4
- **UI Framework**: Tailwind CSS 4.0
- **Iconos**: Heroicons, Lucide React
- **Formularios**: React Hook Form + Yup
- **HTTP Client**: Axios

### DevOps & Herramientas

- **Contenedores**: Docker
- **Control de Versiones**: Git
- **IDE**: Visual Studio 2022 / VS Code
- **Testing**: xUnit (Backend)

---

## 📊 Modelo de Datos

### Entidades Principales

#### 👤 User (Usuario)

```csharp
public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public decimal Salary { get; set; }
    public int RoleId { get; set; }
    public int DepartmentId { get; set; }
}
```

#### 🕒 ExtraHour (Hora Extra)

```csharp
public class ExtraHour
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int ExtraHourTypeId { get; set; }
    public int? ApprovedById { get; set; }
    public required string Status { get; set; } // "Pendiente", "Aprobado", "Rechazado"
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### 🏢 Department (Departamento)

```csharp
public class Department
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
```

#### 👑 Role (Rol)

```csharp
public class Role
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}
```

### Relaciones

- **User** ↔ **Role**: Un usuario tiene un rol
- **User** ↔ **Department**: Un usuario pertenece a un departamento
- **ExtraHour** ↔ **User**: Una hora extra pertenece a un usuario
- **ExtraHour** ↔ **User** (ApprovedBy): Una hora extra puede ser aprobada por un usuario
- **Role** ↔ **Permission**: Un rol puede tener múltiples permisos

---

## 🔌 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/{id}` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

### Horas Extra

- `GET /api/extra-hours` - Obtener todas las horas extra
- `GET /api/extra-hours/{id}` - Obtener hora extra por ID
- `GET /api/extra-hours/user/{userId}` - Obtener horas extra por usuario
- `POST /api/extra-hours` - Crear hora extra
- `PUT /api/extra-hours/{id}` - Actualizar hora extra
- `DELETE /api/extra-hours/{id}` - Eliminar hora extra
- `POST /api/extra-hours/{id}/approve` - Aprobar hora extra
- `POST /api/extra-hours/{id}/reject` - Rechazar hora extra

### Departamentos

- `GET /api/departments` - Obtener todos los departamentos
- `GET /api/departments/{id}` - Obtener departamento por ID
- `POST /api/departments` - Crear departamento
- `PUT /api/departments/{id}` - Actualizar departamento
- `DELETE /api/departments/{id}` - Eliminar departamento

### Roles y Permisos

- `GET /api/roles` - Obtener todos los roles
- `GET /api/permissions` - Obtener todos los permisos

### Aprobaciones

- `GET /api/approvals` - Obtener todas las aprobaciones
- `POST /api/approvals` - Crear aprobación

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **.NET SDK 9.0** o superior
- **Node.js 18** o superior
- **PostgreSQL 12** o superior
- **Visual Studio 2022** o **VS Code**

### 1. Clonar el Repositorio

```bash
git clone --branch feature-UpdateEmployee1 --single-branch https://github.com/Teo1188/CloudNativeAmadeus.git
cd CloudNativeAmadeus
```

### 2. Configurar Backend

#### Restaurar Dependencias

```bash
dotnet restore
```

#### Configurar Base de Datos

1. **Crear base de datos PostgreSQL**
2. **Configurar cadena de conexión** en `ExtraHours.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ExtraHoursDB;User Id=tu_usuario;Password=tu_contraseña;"
  }
}
```

#### Variables de Entorno (Opcional)

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ExtraHoursDB
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
JWT_ISSUER=ExtraHours.API
JWT_AUDIENCE=Client
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Aplicar Migraciones

```bash
cd ExtraHours.API
dotnet ef migrations add InitialCreate --project ../ExtraHours.Infrastructure
dotnet ef database update --project ../ExtraHours.Infrastructure
```

#### Ejecutar Backend

```bash
cd ExtraHours.API
dotnet run
```

La API estará disponible en `https://localhost:5001` y Swagger en `https://localhost:5001/swagger`

### 3. Configurar Frontend

#### Instalar Dependencias

```bash
cd Client
npm install
```

#### Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `Client`:

```env
VITE_API_URL=http://localhost:5001/api
```

#### Ejecutar Frontend

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 4. Datos de Prueba

#### Usuarios Predefinidos

- **Administrador**: `admin@admin.com` / `admin`
- **Empleado**: `dante@empleado.com` / `dante`

---

## 🧪 Pruebas

### Ejecutar Pruebas del Backend

```bash
cd ExtraHours.Test
dotnet test
```

### Pruebas del Frontend

```bash
cd Client
npm run lint
```

---

## 🐳 Docker

### Construir Imágenes

```bash
# Backend
docker build -t extrahours-api .

# Frontend
cd Client
docker build -t extrahours-client .
```

### Ejecutar con Docker Compose

```bash
docker-compose up -d
```

---

## 📱 Funcionalidades del Sistema

### 🔐 Autenticación y Autorización

- **Login/Logout**: Sistema de autenticación con JWT
- **Roles**: Administrador, Supervisor, Empleado
- **Permisos**: Control granular de acceso a funcionalidades
- **Protección de Rutas**: Rutas protegidas según rol del usuario

### 👤 Gestión de Usuarios

- **Registro**: Crear nuevos usuarios con roles y departamentos
- **Perfil**: Ver y editar información personal
- **Administración**: Panel de administración para gestión de usuarios

### 🕒 Gestión de Horas Extra

- **Registro**: Crear solicitudes de horas extra
- **Aprobación**: Flujo de aprobación por supervisores
- **Seguimiento**: Estado de solicitudes (Pendiente, Aprobado, Rechazado)
- **Historial**: Consulta de horas extra por usuario

### 🏢 Gestión de Departamentos

- **CRUD**: Crear, leer, actualizar y eliminar departamentos
- **Asignación**: Asignar usuarios a departamentos
- **Reportes**: Horas extra por departamento

### ⚙️ Configuraciones

- **Tipos de Hora Extra**: Configurar diferentes tipos
- **Configuraciones del Sistema**: Ajustes generales
- **Tema**: Modo claro/oscuro

---

## 🔧 Configuración Avanzada

### CORS

El sistema está configurado para permitir peticiones desde:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:4200`

### JWT

- **Algoritmo**: HS256
- **Expiración**: Configurable
- **Claims**: UserId, Email, Role

### Base de Datos

- **Provider**: PostgreSQL
- **Migrations**: Entity Framework Core
- **Seeding**: Datos iniciales automáticos

---

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de Conexión a Base de Datos

```bash
# Verificar que PostgreSQL esté ejecutándose
# Verificar cadena de conexión en appsettings.json
# Verificar credenciales de base de datos
```

#### Error de CORS

```bash
# Verificar configuración de ALLOWED_ORIGINS
# Verificar que el frontend esté en un puerto permitido
```

#### Error de JWT

```bash
# Verificar JWT_SECRET en variables de entorno
# Verificar que el token no haya expirado
```

#### Error de Migraciones

```bash
# Eliminar migraciones existentes
dotnet ef migrations remove --project ExtraHours.Infrastructure --startup-project ExtraHours.API

# Crear nueva migración
dotnet ef migrations add InitialCreate --project ExtraHours.Infrastructure --startup-project ExtraHours.API
```

---

## 📈 Roadmap

### Versión 1.1

- [ ] Reportes avanzados con gráficos
- [ ] Notificaciones por email
- [ ] Exportación a Excel/PDF
- [ ] Dashboard con métricas

### Versión 1.2

- [ ] API móvil
- [ ] Integración con sistemas de nómina
- [ ] Workflow de aprobación personalizable
- [ ] Auditoría completa

### Versión 2.0

- [ ] Microservicios
- [ ] Event-driven architecture
- [ ] Kubernetes deployment
- [ ] Monitoreo y observabilidad

---

## 👥 Equipo de Desarrollo

### 🏃 Equipo 5 - CloudNativeAmadeus

- **🏃 Duvan Andrés Contreras Franco**
- **🏃 Maria Alejandra Salazar Tangarife**
- **🏃 Mayerly Cristina Salas Pareja**
- **🏃 Juliana Zapata Restrepo**
- **🏃 Felipe Ramirez Yepes**
- **🏃 Michell Londoño Marin**
- **🏃 Estivenson Tadeo Gaviria Florez**

---

## 📄 Licencia

Este proyecto fue desarrollado para **Amadeus** como parte del curso de **Cloud Native Development**.

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo o crea un issue en el repositorio.

---

**🕒 CloudNativeAmadeus - Sistema de Gestión de Horas Extra**  
_Desarrollado con ❤️ por el Grupo 5_
