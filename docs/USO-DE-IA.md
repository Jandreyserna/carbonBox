# Uso de Inteligencia Artificial en esta Prueba

## Herramientas Utilizadas

- [x] Claude Code
- [ ] GitHub Copilot
- [ ] ChatGPT
- [ ] Cursor AI
- [ ] Otra

Usé **Claude Code** durante todo el desarrollo: para aprender las tecnologías que no conocía, generar código y archivos de apoyo, y depurar errores.

---

## ¿Qué Generé con IA?

### Backend

- [x] **Estructura inicial del proyecto.** La IA me ayudó a organizar las carpetas del bounded context `document-processing` por capas (domain, application, infrastructure, presentation), siguiendo DDD y Clean Architecture.
- [x] **Schema de Prisma.** Ya había usado ORMs antes, pero era mi primera vez con Prisma. La IA me ayudó a definir los modelos `Upload` y `ActivityData` y su relación, y a entender las migraciones y el cliente generado.
- [x] **Validaciones de entrada en `ListUploadsController`.** Conversión y validación de `page` y `limit` como enteros, valores por defecto y límite máximo por página.
- [ ] **Lógica de CQRS**: la implementé yo después de que la IA me explicara el patrón (ver *¿Qué Aprendí?*).

### Frontend

- [x] **Estructura de React con Next.js.** No había trabajado con esta tecnología, así que le pedí a la IA una comparación con Angular y ejemplos de cómo se manejan las rutas, los layouts y los componentes. Con esa base armé la estructura del frontend según las especificaciones: rutas en `app/`, lógica en `features/` y piezas compartidas en `shared/`.
- [x] **Toda la interfaz con shadcn/ui.** La IA generó la UI completa: layout con sidebar, dashboard con tarjetas y gráfico, formulario con drag & drop, tablas, badges de estado, skeletons de carga, notificaciones y modo oscuro.

### Archivos de apoyo

- [x] **Archivos de ejemplo:** el CSV de prueba (`docs/sample-data.csv`, 50 filas) y la colección de Insomnia para probar la API.
- [x] **README:** lo redacté con ayuda de la IA, con los pasos de instalación verificados en mi entorno.

---

## ¿Qué Modifiqué o Corregí?

1. **Ejemplos incompletos de la IA.** Algunos fragmentos venían sin los `import` necesarios (por ejemplo, el registro del módulo en Awilix y el `layout.tsx` del frontend), y tuve que completarlos a partir de los errores de TypeScript.
2. **Controllers de una sola acción.** La IA me presentó dos alternativas: un controller por acción o uno por recurso con varios métodos. Elegí mantener un controller por caso de uso porque encaja 1:1 con los handlers de CQRS y con la estructura que pide el enunciado.
3. **Orquestación del procesamiento.** Moví la lógica del procesamiento del CSV a `FileProcessingService`, para que `ProcessFileCommandHandler` solo delegue en él.
4. **Contrato del consumidor de la cola.** Cuando la interfaz `IMessageConsumer`, su implementación y el worker no coincidían en nombres y forma, decidí unificar la interfaz en camelCase (`receiptHandle`, `body`, `deleteMessage`) en lugar de adaptar cada uso por separado.
5. **Contrastar las sugerencias con el enunciado.** La IA presentó el endpoint del resumen del dashboard como obligatorio; lo verifiqué contra el enunciado, no lo exigía, y aun así decidí implementarlo porque es más eficiente que contar en el navegador. También comprobé que el intervalo de 3 segundos es un requisito del polling del frontend, no de la cola.

---

## ¿Qué Aprendí?

1. **Next.js (App Router):**
   - Las carpetas son las rutas (`app/uploads/[id]/page.tsx` equivale a `/uploads/:id`), sin un módulo de routing como en Angular.
   - `layout.tsx` cumple el papel del `<router-outlet>` y recibe la página como `children`.
   - Los componentes son funciones con hooks en lugar de clases con decoradores, y hay que distinguir Server Components de Client Components (`'use client'`).

2. **React Query:**
   - `refetchInterval` para el polling, que se detiene solo cuando el upload termina.
   - `invalidateQueries` para refrescar la lista y el resumen después de subir un archivo.

3. **Prisma:**
   - Definición del schema, migraciones y cliente generado.
   - Por qué se necesitan mappers entre el modelo de la base de datos y las entidades de dominio (por ejemplo, `null` en Prisma frente a `undefined` en el dominio).

4. **CQRS:**
   - Le pedí a la IA que me explicara el patrón y cómo aplicarlo en este proyecto: commands para escribir (`CreateUpload`, `ProcessFile`) y queries para leer (`GetUploadById`, `ListUploads`, `GetUploadResults`, `GetUploadsSummary`), cada uno con su handler.
   - Aprendí a distinguir la lógica de negocio, que vive en el dominio, de la orquestación, que vive en los handlers.

5. **Awilix frente a Inversify:**
   - Le pedí a la IA una comparación entre los dos contenedores y cuándo elegir uno u otro.
   - Inversify se basa en decoradores (`@injectable`, `@inject`) y en `reflect-metadata`, lo que acopla las clases al contenedor.
   - Awilix, en modo `CLASSIC`, inyecta por nombre de parámetro del constructor, así las clases de dominio y aplicación no conocen el contenedor.
   - Elegí Awilix por eso, y porque es el que recomienda el enunciado.
   - Aprendí también que Awilix resuelve las dependencias en tiempo de ejecución: TypeScript no detecta si falta registrar una pieza.

6. **LocalStack en Docker:**
   - Tuve problemas para correr LocalStack y usé la IA para resolverlos.
   - Primero, el contenedor no arrancaba: la imagen `latest` exigía un token de licencia, y lo resolví con una cuenta gratuita de LocalStack.
   - Después, para que el cliente de S3 se conectara a LocalStack hizo falta `forcePathStyle: true`. La IA me explicó la diferencia entre las URLs *path-style* (`localhost:4566/bucket/archivo`) y *virtual-hosted* (`bucket.localhost:4566/archivo`), y por qué LocalStack necesita la primera.

7. **Manejo de errores con Either:** todos los handlers devuelven `Either`, un `BaseController` traduce los errores de dominio a códigos HTTP, y el manejador global de Fastify atrapa lo inesperado, sin `try/catch` en los controllers.

---

## Limitaciones Encontradas con IA

1. **Código de ejemplo incompleto.** Algunos fragmentos omitían `import` o dependían de archivos que se creaban en un paso posterior, así que tuve que revisarlos antes de usarlos.
2. **Sugerencias que iban más allá del enunciado.** En algunos casos la IA presentó como requisito algo que no lo era, y tuve que contrastarlo con el documento de la prueba antes de decidir.
3. **Volumen de código generado en la UI.** shadcn/ui genera muchos componentes base (`shared/components/ui`), y tuve que revisar ese código para entender qué hace cada pieza y poder explicarlo.

---

## Tiempo Invertido

| Etapa | Tiempo |
|---|---|
| Setup y configuración | _2 horas_ |
| Backend (con ayuda de IA) | _7 horas_ |
| Frontend (con ayuda de IA) | _5 horas_ |
| Debugging y ajustes | _1 horas_ |
| **Total** | _15 horas_ |
