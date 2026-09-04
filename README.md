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

## Decisiones Técnicas y de Diseño (Engineering Decisions)

Para demostrar una disciplina avanzada de Ingeniería Frontend y Arquitectura, se tomaron decisiones adicionales más allá del simple cumplimiento de requerimientos:

- **Sistema de Diseño (Design System):** Se construyó un sistema de tokens basado en variables CSS (`src/styles/tokens.css`). Esto permitió abandonar clases utilitarias rígidas (Bootstrap) en favor de una arquitectura UI moderna y escalable.
- **Soporte Multidioma (i18n):** Se integró `react-i18next` para ofrecer soporte nativo en Español e Inglés, abstrayendo todos los textos quemados hacia diccionarios semánticos (ej. `ecommerce.title`).
- **Modo Claro / Oscuro Dinámico:** Se implementó un ThemeSwitcher persitente. El "Modo Claro" está diseñado para transmitir la confiabilidad y profesionalismo corporativo de **SISTRAN**, mientras que el "Modo Oscuro" utiliza una paleta enfocada al ámbito de ingeniería "developer" de Fenner Eduardo.
- **Primitivas UI y Component Testing:** Se extrajeron componentes base (Button, Input, Card) para fomentar reutilización de código. Se agregaron pruebas de componentes aisladas (Component Testing) utilizando Cypress para certificar su funcionamiento independiente.
- **Global Exception Middleware (Backend):** El backend estandariza respuestas a través de un `ApiResponse<T>`, atrapando excepciones para que el frontend jamás procese StackTraces o errores no formateados.
- **Optimización Cloud:** La infraestructura de Docker Compose fue optimizada para despliegues ligeros (t2.micro en AWS), controlando el uso de memoria de SQL Server.
