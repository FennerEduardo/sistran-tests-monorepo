# SISTRAN Pruebas Técnicas - Monorrepo

Este repositorio contiene la solución a las pruebas técnicas para el perfil de Desarrollador .NET y React. La solución está construida utilizando una arquitectura de monorrepo (gestionada con `pnpm workspaces`) y contenedorizada completamente con Docker.

## Estructura del Proyecto

- `apps/backend`: Proyecto Web API en .NET 8 (C#) con Entity Framework Core.
- `apps/frontend`: Aplicación SPA en React (Vite + TypeScript).
- `apps/e2e`: Proyecto de pruebas End-to-End utilizando Cypress.
- `apps/backend.tests.unit`: Pruebas unitarias en xUnit y Moq para el backend.
- `apps/backend.tests.integration`: Pruebas de integración en xUnit para el backend.
- `features/`: Archivos Gherkin (.feature) detallando los escenarios principales.

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/) instalados.
- (Opcional) `.NET 8 SDK`, `Node.js v20+`, y `pnpm` si deseas ejecutar y probar sin Docker de forma local.

## Guía de Levantamiento en Local con Docker

Toda la infraestructura está configurada para levantarse de forma sencilla y eficiente, optimizada para ejecutarse en entornos limitados (como la capa gratuita de AWS). El contenedor de SQL Server Express está limitado a 1GB de RAM para evitar problemas de agotamiento de memoria.

1. **Clonar el repositorio y ubicarse en la raíz**:
   ```bash
   cd sistran-tests-monorepo
   ```

2. **Levantar los servicios con Docker Compose**:
   ```bash
   docker-compose up --build -d
   ```

3. **Verificar que los servicios estén activos**:
   Al finalizar la construcción e inicio, tendrás 3 servicios corriendo:
   - **Frontend (React)**: Accesible a través de [http://localhost](http://localhost)
   - **Backend (.NET API)**: Accesible a través de [http://localhost:5000](http://localhost:5000)
   - **Base de Datos (SQL Server)**: Accesible en el puerto `1433`. Las migraciones de base de datos se ejecutan de manera automática al inicializar el backend.

4. **Detener los servicios**:
   ```bash
   docker-compose down
   ```

## Ejecución de Pruebas

El monorrepo cuenta con un robusto sistema de testing que puede correrse de manera local (requiere Node/pnpm y .NET SDK instalados):

- **Pruebas de Backend (Unit & Integration)**:
  ```bash
  cd apps/backend.tests.unit
  dotnet test
  ```

- **Pruebas de Frontend (Unit)**:
  ```bash
  cd apps/frontend
  pnpm test
  ```

- **Pruebas E2E (Cypress)**:
  ```bash
  cd apps/e2e
  pnpm cypress run
  ```

## Decisiones Técnicas Destacadas

- **Global Exception Middleware**: El backend tiene implementado un formato estándar de respuesta (`ApiResponse<T>`) el cual atrapa excepciones globales e impide enviar StackTraces u objetos rotos al frontend.
- **Frontend Types**: El frontend mapea estas respuestas tipadas fuertemente con TypeScript para un mejor manejo de errores en el UI.
- **Optimización AWS**: La arquitectura Docker está pensada para ser desplegable directamente en una instancia EC2 `t2.micro` utilizando Amazon Linux o Ubuntu Server, manteniendo el footprint de memoria de SQL Server bajo control.
