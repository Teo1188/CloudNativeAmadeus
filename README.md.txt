<<<<<<< HEAD
    # 🕒 Sistema de Registro de Horas Extra - Frontend

Este es el frontend del sistema de registro de horas extra desarrollado por el Grupo 5 para la empresa **Amadeus**. El proyecto fue construido utilizando **Vite**, **React** y **Tailwind CSS**, ofreciendo una interfaz rápida, moderna y responsiva.

---

## 🚀 Tecnologías Utilizadas

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Instalación

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior) y `npm`.

1. Clona el repositorio:

```bash
git clone --branch feature-UpdateEmployee1 --single-branch https://github.com/Teo1188/CloudNativeAmadeus.git
```

2. Accede al directorio del proyecto:

```bash
cd FrontEnd-Grupo5
```

```bash
cd Client
```

3. Instala las dependencias:

```bash
npm install
```

4. Ejecuta el frontend:

```bash
npm run dev
```

5. abre en el navegador:

Al ejecutar el proyecto frontend el vite te sacara mensaje como:
```bash
➜  Local:   http://localhost:5173/
```
Ingresar a la direccion suministrada para visualizar proyecto.

# 🕒 Sistema de Registro de Horas Extra - Backend

Este es el backend del sistema de registro de horas extra de la empresa **Amadeus**, desarrollado por el **Grupo 5**. El proyecto está construido utilizando **C#** y sigue una arquitectura modular para facilitar su mantenimiento y escalabilidad.

## 📂 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:
- `Client/`: Frontend del aplicativo.
- `ExtraHours.API/`: Contiene la implementación de la API que expone los endpoints para interactuar con el sistema.
- `ExtraHours.CORE/`: Incluye las entidades y lógica de negocio fundamentales del sistema.
- `ExtraHours.Infrastructure/`: Gestiona la comunicación con la base de datos y otras infraestructuras externas.
- `ExtraHours.Test/`: Contiene las pruebas unitarias y de integración para garantizar la calidad del código.
- `ExtraHourGroup5.sln`: Archivo de solución que agrupa todos los proyectos mencionados anteriormente.

## 🛠️ Requisitos Previos

- [Visual Studio](https://visualstudio.microsoft.com/) (versión recomendada: 2022 o superior)
- [.NET SDK](https://dotnet.microsoft.com/download) (versión 6.0 o superior)
- [PostgreSQL](https://www.postgresql.org)

## 🚀 Instalación y Configuración

1. **Despues de clonar el repositorio:**

vamos a ingresar en la carpeta principal para correr las dependencias

   ```bash
   cd FrontEnd-Grupo5
   ```
2. luego ejecutamos:

   ```bash
   dotnet restore
   ```

3. Abrir la solución en Visual Studio:

Navega al directorio del proyecto y abre el archivo ExtraHourGroup5.sln.

4. Configurar la cadena de conexión:

En el proyecto ExtraHours.API, localiza el archivo appsettings.json y actualiza la cadena de conexión para que coincida con tu configuración de base de datos:

```bash
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR;Database=TU_BASE_DE_DATOS;User Id=TU_USUARIO;Password=TU_CONTRASEÑA;"
}
```
5. Aplicar las migraciones de la base de datos:

Abre la Consola del Administrador de Paquetes en Visual Studio y ejecuta:

```bash
dotnet ef migrations add InitialCreate --project ExtraHours.Infrastructure --startup-project ExtraHours.API
```

y luego:

```bash
dotnet ef database update --project ExtraHours.Infrastructure --startup-project ExtraHours.API
```

Esto creará las tablas necesarias en la base de datos especificada.

5. Ejecutar la aplicación:

ingresa a la carpeta de ExtraHours.API:

```bash
cd ExtraHours.API
```

y ejecutamos:

```bash
dotnet run
```

Establece ExtraHours.API como el proyecto de inicio y ejecuta la aplicación. La API estará disponible en "https://localhost:5001->puerto asignado" + /swagger



## 🏃🏃🏃🏃🏃🏃🏃Equipo 5:

- 🏃 Duvan Andrés Contreras Franco  
- 🏃 Maria Alejandra Salazar Tangarife  
- 🏃 Mayerly Cristina Salas Pareja  
- 🏃 Juliana Zapata Restrepo  
- 🏃 Felipe Ramirez Yepes  
- 🏃 Michell Londoño Marin  
- 🏃 Estivenson Tadeo Gaviria Florez 
=======
    # 🕒 Sistema de Registro de Horas Extra - Frontend

Este es el frontend del sistema de registro de horas extra desarrollado por el Grupo 5 para la empresa **Amadeus**. El proyecto fue construido utilizando **Vite**, **React** y **Tailwind CSS**, ofreciendo una interfaz rápida, moderna y responsiva.

---

## 🚀 Tecnologías Utilizadas

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Instalación

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior) y `npm`.

1. Clona el repositorio:

```bash
git clone --branch feature-UpdateEmployee1 --single-branch https://github.com/Teo1188/CloudNativeAmadeus.git
```

2. Accede al directorio del proyecto:

```bash
cd FrontEnd-Grupo5
```

```bash
cd Client
```

3. Instala las dependencias:

```bash
npm install
```

4. Ejecuta el frontend:

```bash
npm run dev
```

5. abre en el navegador:

Al ejecutar el proyecto frontend el vite te sacara mensaje como:
```bash
➜  Local:   http://localhost:5173/
```
Ingresar a la direccion suministrada para visualizar proyecto.

# 🕒 Sistema de Registro de Horas Extra - Backend

Este es el backend del sistema de registro de horas extra de la empresa **Amadeus**, desarrollado por el **Grupo 5**. El proyecto está construido utilizando **C#** y sigue una arquitectura modular para facilitar su mantenimiento y escalabilidad.

## 📂 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:
- `Client/`: Frontend del aplicativo.
- `ExtraHours.API/`: Contiene la implementación de la API que expone los endpoints para interactuar con el sistema.
- `ExtraHours.CORE/`: Incluye las entidades y lógica de negocio fundamentales del sistema.
- `ExtraHours.Infrastructure/`: Gestiona la comunicación con la base de datos y otras infraestructuras externas.
- `ExtraHours.Test/`: Contiene las pruebas unitarias y de integración para garantizar la calidad del código.
- `ExtraHourGroup5.sln`: Archivo de solución que agrupa todos los proyectos mencionados anteriormente.

## 🛠️ Requisitos Previos

- [Visual Studio](https://visualstudio.microsoft.com/) (versión recomendada: 2022 o superior)
- [.NET SDK](https://dotnet.microsoft.com/download) (versión 6.0 o superior)
- [PostgreSQL](https://www.postgresql.org)

## 🚀 Instalación y Configuración

1. **Despues de clonar el repositorio:**

vamos a ingresar en la carpeta principal para correr las dependencias

   ```bash
   cd FrontEnd-Grupo5
   ```
2. luego ejecutamos:

   ```bash
   dotnet restore
   ```

3. Abrir la solución en Visual Studio:

Navega al directorio del proyecto y abre el archivo ExtraHourGroup5.sln.

4. Configurar la cadena de conexión:

En el proyecto ExtraHours.API, localiza el archivo appsettings.json y actualiza la cadena de conexión para que coincida con tu configuración de base de datos:

```bash
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR;Database=TU_BASE_DE_DATOS;User Id=TU_USUARIO;Password=TU_CONTRASEÑA;"
}
```
5. Aplicar las migraciones de la base de datos:

Abre la Consola del Administrador de Paquetes en Visual Studio y ejecuta:

```bash
dotnet ef migrations add InitialCreate --project ExtraHours.Infrastructure --startup-project ExtraHours.API
```

y luego:

```bash
dotnet ef database update --project ExtraHours.Infrastructure --startup-project ExtraHours.API
```

Esto creará las tablas necesarias en la base de datos especificada.

5. Ejecutar la aplicación:

ingresa a la carpeta de ExtraHours.API:

```bash
cd ExtraHours.API
```

y ejecutamos:

```bash
dotnet run
```

Establece ExtraHours.API como el proyecto de inicio y ejecuta la aplicación. La API estará disponible en "https://localhost:5001->puerto asignado" + /swagger



## 🏃🏃🏃🏃🏃🏃🏃Equipo 5:

- 🏃 Duvan Andrés Contreras Franco  
- 🏃 Maria Alejandra Salazar Tangarife  
- 🏃 Mayerly Cristina Salas Pareja  
- 🏃 Juliana Zapata Restrepo  
- 🏃 Felipe Ramirez Yepes  
- 🏃 Michell Londoño Marin  
- 🏃 Estivenson Tadeo Gaviria Florez 
>>>>>>> 3193a045ffdf83df6116905ad884225eb8de359e
