# Guía paso a paso: Frontend de CarbonBox con Next.js

Pensada para alguien que ya conoce Angular y/o Vue y **nunca ha usado Next.js**. Cada paso es pequeño, explica el concepto de Next.js con su equivalente en Angular/Vue, y termina con una forma de comprobar que funcionó.

Versiones verificadas al escribir la guía: Next.js 16, React 19, Tailwind CSS 4, TanStack Query 5, Axios 1.x.
El enunciado pide "Next.js 14+ con App Router": la 16 lo cumple.

---

## Parte 0. Mapa mental: de Angular/Vue a Next.js

Next.js es un framework **sobre React**. React es la librería de componentes (equivale a lo que hace Vue por sí solo). Next.js le agrega routing, layouts, build y servidor (equivale a lo que Angular CLI + Angular Router traen, o a Nuxt en el mundo Vue).

| Concepto | Angular | Vue | Next.js (App Router) |
|---|---|---|---|
| Componente | clase + `@Component` + template | `.vue` (SFC) | **función** que devuelve JSX (`.tsx`) |
| Estado local | propiedades / signals | `ref()` / `reactive()` | `useState()` |
| Efectos / ciclo de vida | `ngOnInit`, `ngOnDestroy` | `onMounted`, `watch` | `useEffect()` |
| Plantilla | HTML con `*ngIf`, `*ngFor` | `v-if`, `v-for` | **JSX**: `{cond && <A/>}`, `{lista.map(...)}` |
| Inyección de dependencias | servicios + DI | `provide/inject` | **no hay DI**: se importan funciones/hooks, o se usa Context |
| Servicio HTTP | `HttpClient` en un servicio | composables / axios | funciones + hooks de React Query |
| Router | `RouterModule` con rutas declaradas | `vue-router` con rutas declaradas | **las carpetas son las rutas** (file-based) |
| Outlet | `<router-outlet>` | `<router-view>` | `layout.tsx` recibe `children` |
| Enlace | `routerLink` | `<router-link>` | `<Link href="...">` de `next/link` |
| Navegar por código | `router.navigate()` | `router.push()` | `router.push()` de `next/navigation` |
| Variables de entorno | `environment.ts` | `import.meta.env.VITE_*` | `.env.local` + prefijo `NEXT_PUBLIC_` |
| Proxy de desarrollo | `proxy.conf.json` | `vite.config` proxy | `rewrites` en `next.config.ts` |

### Las 6 ideas de Next.js que sí o sí debes entender

**1. Las carpetas son rutas.** Dentro de `src/app/`, cada carpeta es un tramo de URL y el archivo `page.tsx` es lo que se muestra en esa URL.

```
src/app/page.tsx                  →  /
src/app/uploads/page.tsx          →  /uploads
src/app/uploads/new/page.tsx      →  /uploads/new
src/app/uploads/[id]/page.tsx     →  /uploads/abc-123   (los corchetes = parámetro, como :id)
```
No hay un archivo central de rutas: no existe el `app-routing.module.ts` ni el `router/index.ts`.

**2. `layout.tsx` es el envoltorio.** Es como `app.component.html` con su `<router-outlet>` o `App.vue` con `<router-view>`. Lo que pongas ahí (menú, cabecera) persiste al navegar entre páginas. Recibe `children`, que es la página actual.

**3. Server Components vs Client Components (lo más importante y lo más confuso).**
Por defecto, **todos los componentes en Next.js se ejecutan en el servidor** (son "Server Components") y llegan al navegador como HTML ya armado. Eso significa que en ellos **no puedes usar** `useState`, `useEffect`, `onClick`, ni hooks de React Query. Para eso necesitas un "Client Component", y se declara escribiendo `'use client'` en la **primera línea** del archivo.

> Regla práctica para esta prueba: **si el archivo usa un hook (`useState`, `useQuery`, `useRouter`...) o un evento (`onClick`, `onChange`, `onSubmit`), ponle `'use client'` arriba.** Como casi toda tu UI va a depender de React Query, la mayoría de tus componentes serán "client". Está bien.

Piensa en ello como en Angular Universal / Nuxt SSR: el HTML inicial se renderiza en el servidor y luego el navegador lo "hidrata" (le da vida). La diferencia es que en Next.js tú decides archivo por archivo qué corre dónde.

**4. `params` en rutas dinámicas es una Promise (desde Next 15).** En un `page.tsx` de servidor, `params` llega como `Promise<{ id: string }>` y hay que hacerle `await`. Para evitarte ese problema, en esta prueba usa el hook `useParams()` de `next/navigation` dentro de un componente cliente (lo verás en el Paso 13).

**5. Variables de entorno.** Se ponen en `.env.local`. Solo las que empiezan con `NEXT_PUBLIC_` llegan al navegador; las demás quedan solo en el servidor. **Si cambias `.env.local`, reinicia `npm run dev`**: se lee al arrancar.

**6. Imports con `@/`.** El proyecto se genera con el alias `@/*` apuntando a `src/*`. Escribes `import { x } from '@/shared/lib/api-client'` en vez de rutas relativas `../../../`. Es el equivalente a los `paths` de tu `tsconfig` en Angular.

---

## Paso 0. Antes de empezar: requisitos

Tienes que tener corriendo el backend completo, porque el frontend va a consumirlo:

```bash
docker compose up -d          # Postgres + LocalStack (desde la raíz del repo)
cd backend
npm run dev                   # API en http://localhost:3000
npm run worker                # en otra terminal
```

Recuerda que LocalStack pierde el bucket y la cola al reiniciarse: si subir un archivo da 500, recréalos.

✅ **Comprobación:** `GET http://localhost:3000/api/v1/uploads/summary` responde `200` con los conteos.

---

## Paso 1. Crear el proyecto Next.js

Desde la **raíz del repositorio** (donde están `backend/` y `docs/`):

```bash
npx create-next-app@latest frontend
```

Responde así a las preguntas (si te las hace; las opciones pueden variar un poco):

| Pregunta | Respuesta |
|---|---|
| TypeScript | **Yes** |
| Linter | ESLint |
| Tailwind CSS | **Yes** |
| `src/` directory | **Yes** |
| App Router | **Yes** |
| Import alias | `@/*` (el valor por defecto) |
| Package manager | npm |

Alternativa no interactiva (hace lo mismo):
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Qué te genera** (esto lo verifiqué generando un proyecto real):

```
frontend/
├── src/app/
│   ├── layout.tsx        ← el envoltorio (como app.component.html)
│   ├── page.tsx          ← la ruta "/"
│   ├── globals.css       ← estilos globales + Tailwind
│   └── favicon.ico
├── public/               ← archivos estáticos (como assets/ en Angular)
├── next.config.ts        ← configuración de Next
├── tsconfig.json
├── postcss.config.mjs    ← lo usa Tailwind
├── eslint.config.mjs
├── package.json
├── AGENTS.md y CLAUDE.md ← instrucciones para asistentes de IA; puedes dejarlos o borrarlos
└── README.md
```

Dos diferencias respecto a tutoriales viejos que verás por internet:
- **No hay `tailwind.config.ts`.** Tailwind 4 se configura dentro de `globals.css` con `@import "tailwindcss";`. El enunciado lista `tailwind.config.ts` en su estructura, pero es solo una referencia: con Tailwind 4 no hace falta.
- **No hay carpeta `pages/`.** Eso era el router antiguo. Ignora cualquier tutorial que hable de `pages/` o `getServerSideProps`.

✅ **Comprobación:** existe la carpeta `frontend/` con `package.json`.

---

## Paso 2. Arrancarlo en el puerto 3001

Tu backend ya usa el puerto **3000**, y Next también arranca en 3000 por defecto. Hay que moverlo.

En `frontend/package.json`, cambia el script `dev`:

```json
"dev": "next dev -p 3001"
```

Luego:
```bash
cd frontend
npm run dev
```

✅ **Comprobación:** abre `http://localhost:3001` y ves la página de bienvenida de Next.js. Edita algo en `src/app/page.tsx` y guarda: el navegador se actualiza solo (hot reload, igual que `ng serve`).

---

## Paso 3. Instalar las dependencias del enunciado

```bash
cd frontend
npm install @tanstack/react-query axios
npm install -D @tanstack/react-query-devtools   # opcional, muy útil para ver el caché
```

- **Axios**: el cliente HTTP que pide el enunciado (equivale a `HttpClient` de Angular).
- **TanStack Query (React Query)**: maneja peticiones, caché, estados de carga/error y **polling**. Para un dev de Angular: hace lo que harías con un servicio + RxJS (`shareReplay`, `interval`, `switchMap`), pero con una API declarativa.

✅ **Comprobación:** ambos aparecen en `dependencies` del `package.json`.

---

## Paso 4. Variables de entorno y CORS

### 4.1 Variable de entorno

Crea `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```
Y `frontend/.env.example` (este sí va al repo, sin valores sensibles):
```
NEXT_PUBLIC_API_URL=
```
Comprueba que `.env*.local` esté ignorado por git (el `.gitignore` que genera Next ya lo hace).

### 4.2 El problema de CORS (te va a pasar sí o sí)

Tu página vive en `localhost:3001` y tu API en `localhost:3000`. Para el navegador son **orígenes distintos**, y bloquea las peticiones a menos que el backend lo permita con cabeceras CORS. Es el mismo problema que en Angular cuando no usas `proxy.conf.json`.

Tu backend Fastify **todavía no tiene CORS**. Tienes dos caminos:

**Opción A (recomendada): habilitar CORS en el backend.**
```bash
cd backend
npm install @fastify/cors@9
```
> **Importante: instala la versión `@9`, no la última.** Tu backend usa Fastify 4 y `@fastify/cors` 10 en adelante es para Fastify 5 (con `npm install @fastify/cors` a secas te instalaría una versión incompatible).

Y en `backend/src/main/index.ts`, junto al registro de `multipart`:
```ts
import cors from '@fastify/cors';

app.register(cors, { origin: 'http://localhost:3001' });
```
En las peticiones `POST` con archivo, el navegador manda primero una petición "preflight" (`OPTIONS`) preguntando si el origen tiene permiso, y el plugin la contesta por ti.

**Opción B: proxy de Next (`rewrites`), sin tocar el backend.** En `frontend/next.config.ts`:
```ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' }];
  },
};
```
Con esto el navegador le habla a `localhost:3001/api/v1/...` (mismo origen) y Next reenvía al backend. Es el equivalente exacto de `proxy.conf.json`. Si eliges esta, `NEXT_PUBLIC_API_URL` sería `/api/v1`.

> Elige una y sigue con ella. La guía asume la **A**.

✅ **Comprobación (opción A):** en el Paso 7, cuando hagas la primera petición desde el navegador, no debe aparecer el error `blocked by CORS policy` en la consola.

---

## Paso 5. Crear la estructura de carpetas

El enunciado propone esta organización. Créala dentro de `frontend/src/`:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      ← Dashboard "/"
│   └── uploads/
│       ├── page.tsx                  ← Lista "/uploads"
│       ├── new/page.tsx              ← Formulario "/uploads/new"
│       └── [id]/page.tsx             ← Detalle "/uploads/:id"
├── features/
│   └── document-processing/
│       ├── api/uploadsApi.ts         ← funciones HTTP + hooks de React Query
│       ├── components/               ← UploadForm, UploadList, UploadDetail, ProcessingStatus, ResultsTable
│       └── types/upload.types.ts
└── shared/
    ├── components/                   ← Layout/Navbar, LoadingSpinner, StatusBadge
    └── lib/
        ├── api-client.ts             ← instancia de Axios
        └── query-client.ts / providers.tsx
```

Idea de fondo: **`app/` solo contiene rutas** (páginas delgadas), y la lógica y los componentes viven en `features/` y `shared/`. Es como separar en Angular los módulos de feature del routing.

Las carpetas que no son rutas (`features/`, `shared/`) no necesitan ningún archivo especial: Next solo trata como ruta lo que está dentro de `app/`.

✅ **Comprobación:** las carpetas existen. Aún no hay nada que ver en el navegador.

---

## Paso 6. Definir los tipos

Antes de escribir código de red, define la forma de lo que devuelve tu API. Son las respuestas reales que verificamos en el backend.

`features/document-processing/types/upload.types.ts`:

```ts
export type UploadStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Upload {
  id: string;
  fileName: string;
  status: UploadStatus;
  userId: string;
  totalRows?: number;      // opcionales: el backend los omite hasta que el worker termina
  processedRows?: number;
  failedRows?: number;
  errorMessage?: string;
  createdAt: string;       // las fechas llegan como texto ISO en el JSON, no como Date
  updatedAt: string;
}

export interface PaginatedUploads {
  data: Upload[];
  total: number;
  page: number;
  limit: number;
}

export interface ActivityDataRow {
  category: string;
  amount: number;
  unit: string;
  date: string;
}

export interface UploadResults {
  data: ActivityDataRow[];
}

export interface UploadsSummary {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface CreateUploadResponse {
  id: string;
}
```

> Nota: el enunciado dice que `POST /uploads` devuelve `{ id, status, fileName, createdAt }`, pero tu backend hoy devuelve solo `{ id }`. Para esta guía basta con el `id` (es lo que necesitas para redirigir al detalle). Si quieres cumplir el enunciado al pie de la letra, es un cambio pequeño en `CreateUploadController`.

Los errores del backend siempre tienen la forma `{ "error": "mensaje" }`.

✅ **Comprobación:** el archivo compila (sin subrayados rojos en el editor).

---

## Paso 7. El cliente Axios

`shared/lib/api-client.ts`:

```ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? error.message;
  }
  return 'Error inesperado';
}
```

- `axios.create` es lo mismo que configurar un `HttpClient` con interceptores/base URL en Angular: creas **una** instancia y la reutilizas.
- `getErrorMessage` saca el `{ error: "..." }` que manda tu backend para mostrarlo al usuario.

✅ **Comprobación rápida:** en `src/app/page.tsx` (temporalmente) haz una petición de prueba dentro de un componente cliente y mira la pestaña *Network* del navegador; debe responder 200 sin error de CORS. Bórralo después.

---

## Paso 8. El Provider de React Query y el layout

### 8.1 Por qué hace falta un Provider

React Query guarda su caché en un objeto `QueryClient` que debe estar disponible para toda la app. En Angular sería un servicio `providedIn: 'root'`; en Vue, `app.use(plugin)`. En React se hace envolviendo la app en un **Provider** (un componente que reparte un valor a todos sus descendientes por "Context").

Como usa estado, tiene que ser un Client Component. `shared/lib/providers.tsx`:

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

> Detalle importante: el `QueryClient` se crea **dentro de `useState`** para que no se recree en cada render. Es un error clásico crearlo fuera del componente en Next.

### 8.2 Usarlo en el layout

En `src/app/layout.tsx` envuelve `{children}`:

```tsx
<body className="min-h-full flex flex-col">
  <Providers>
    <Navbar />
    <main className="mx-auto w-full max-w-5xl p-6">{children}</main>
  </Providers>
</body>
```

`layout.tsx` sigue siendo un Server Component (no lleva `'use client'`): puede renderizar un componente cliente (`Providers`) dentro. Esa mezcla es normal en Next.

También en este archivo cambia el `metadata`:
```ts
export const metadata: Metadata = { title: 'CarbonBox', description: 'Procesamiento de documentos' };
```
(`metadata` reemplaza al `<title>` que en Angular pondrías con el servicio `Title`.)

### 8.3 Navbar

Crea `shared/components/Navbar.tsx` con enlaces a `/`, `/uploads` y `/uploads/new` usando `Link` de `next/link`:

```tsx
import Link from 'next/link';
// <Link href="/uploads">Uploads</Link>
```
No hace falta `'use client'` si solo usa `Link` y nada de hooks.

✅ **Comprobación:** recarga `localhost:3001`: ves tu barra de navegación arriba y, al pulsar los enlaces, la URL cambia **sin recargar toda la página** (navegación SPA). Las rutas aún darán 404 hasta que crees sus `page.tsx`.

---

## Paso 9. La capa de API: funciones y hooks

Este es el equivalente a tu servicio de Angular. `features/document-processing/api/uploadsApi.ts` tiene dos partes.

### 9.1 Funciones HTTP planas

```ts
import { apiClient } from '@/shared/lib/api-client';
import type {
  CreateUploadResponse, PaginatedUploads, Upload, UploadResults, UploadsSummary,
} from '../types/upload.types';

export const USER_ID = 'user-123'; // el enunciado permite asumir un único usuario

export async function createUpload(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', USER_ID);

  const { data } = await apiClient.post<CreateUploadResponse>('/uploads', formData, {
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return data;
}

export async function getUploads(page: number, limit = 10) {
  const { data } = await apiClient.get<PaginatedUploads>('/uploads', {
    params: { page, limit, userId: USER_ID },
  });
  return data;
}

export async function getUploadById(id: string) {
  const { data } = await apiClient.get<Upload>(`/uploads/${id}`);
  return data;
}

export async function getUploadResults(id: string) {
  const { data } = await apiClient.get<UploadResults>(`/uploads/${id}/results`);
  return data;
}

export async function getUploadsSummary() {
  const { data } = await apiClient.get<UploadsSummary>('/uploads/summary', {
    params: { userId: USER_ID },
  });
  return data;
}
```

Dos detalles:
- **No pongas `Content-Type` a mano al subir un archivo.** Con `FormData`, el navegador lo calcula solo (incluye el `boundary`). Si lo fuerzas, el backend no podrá leer el multipart.
- `onUploadProgress` es lo que alimenta el "indicador de progreso durante la subida" del enunciado.

### 9.2 Hooks de React Query

En el mismo archivo (o en uno aparte `hooks.ts`) — necesita `'use client'` si lo separas:

```ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const uploadKeys = {
  all: ['uploads'] as const,
  list: (page: number) => ['uploads', 'list', page] as const,
  detail: (id: string) => ['uploads', 'detail', id] as const,
  results: (id: string) => ['uploads', 'results', id] as const,
  summary: ['uploads', 'summary'] as const,
};

export function useUploads(page: number) {
  return useQuery({
    queryKey: uploadKeys.list(page),
    queryFn: () => getUploads(page),
    placeholderData: keepPreviousData, // al cambiar de página, mantiene la anterior mientras carga la nueva
  });
}

export function useUpload(id: string) {
  return useQuery({
    queryKey: uploadKeys.detail(id),
    queryFn: () => getUploadById(id),
    // POLLING: reintenta cada 3 s mientras siga pendiente o procesando, y se detiene solo
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? 3000 : false;
    },
  });
}

export function useUploadResults(id: string, enabled: boolean) {
  return useQuery({
    queryKey: uploadKeys.results(id),
    queryFn: () => getUploadResults(id),
    enabled, // solo se pide cuando el upload ya está COMPLETED
  });
}

export function useUploadsSummary() {
  return useQuery({ queryKey: uploadKeys.summary, queryFn: getUploadsSummary });
}

export function useCreateUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (p: number) => void }) =>
      createUpload(file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: uploadKeys.all }), // refresca listas y resumen
  });
}
```

### Conceptos de React Query (equivalencias)

| React Query | Qué es | Equivalente Angular/Vue |
|---|---|---|
| `useQuery` | Pide datos y los cachea | un `Observable` con `shareReplay` / un `computed` async |
| `queryKey` | Identificador del caché (como una clave) | la "clave" de tu caché manual |
| `data`, `isPending`, `isError`, `error` | Estados que devuelve el hook | `async pipe` + flags de loading/error |
| `useMutation` | Escritura (POST/PUT/DELETE) | llamar a un método del servicio y suscribirse |
| `invalidateQueries` | Marca datos como viejos y los vuelve a pedir | volver a disparar el `switchMap` |
| `refetchInterval` | **Polling** | `interval(3000).pipe(switchMap(...))` |

> **Sobre el polling:** el enunciado dice "polling mientras PROCESSING", pero justo después de subir el archivo el estado es `PENDING` (aún no lo tomó el worker). Por eso el hook hace polling en **ambos** estados. Si solo lo hicieras en `PROCESSING`, la página se quedaría congelada en `PENDING`.

✅ **Comprobación:** aún sin UI, puedes verificarlos en el Paso 11.

---

## Paso 10. Componentes compartidos pequeños

### 10.1 `StatusBadge`

`shared/components/StatusBadge.tsx`. Recibe un `status` y pinta un badge con los colores del enunciado:

| Estado | Color |
|---|---|
| `PENDING` | amarillo |
| `PROCESSING` | azul |
| `COMPLETED` | verde |
| `FAILED` | rojo |

Con Tailwind, un mapa de estado a clases:

```tsx
const styles: Record<UploadStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: UploadStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
```
(Es un Client Component solo si más adelante le agregas hooks; así como está, no necesita `'use client'`.)

**Concepto — props:** los parámetros de la función son las `@Input()` de Angular / `defineProps` de Vue.

### 10.2 `LoadingSpinner`

Un `<div>` con la clase `animate-spin` de Tailwind. Reutilízalo en todas las pantallas mientras `isPending` sea `true`.

### 10.3 Helper de fechas

Crea una función `formatDate(iso: string)` en `shared/lib/`.

> ⚠️ **Trampa de hidratación:** si formateas fechas con `toLocaleString()` en un componente que se renderiza primero en el servidor y luego en el navegador, si la zona horaria/idioma difiere verás el aviso *"Hydration failed / text content does not match"*. Evítalo usando un formato fijo, por ejemplo `new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(iso))`, o renderizando las fechas solo tras cargar los datos con React Query (que ocurre en el cliente).

✅ **Comprobación:** los renderizas temporalmente en una página con datos de mentira y ves los 4 colores.

---

## Paso 11. Página: Lista de uploads (`/uploads`)

Archivo de ruta (delgado) `src/app/uploads/page.tsx`:
```tsx
import { UploadList } from '@/features/document-processing/components/UploadList';

export default function UploadsPage() {
  return <UploadList />;
}
```
Fíjate: es un Server Component que solo compone. **El `export default` es obligatorio en los `page.tsx`**: es lo que Next reconoce como la página.

`features/document-processing/components/UploadList.tsx` (con `'use client'` arriba) debe:

- Guardar el número de página con `const [page, setPage] = useState(1)`.
- Llamar `const { data, isPending, isError, error } = useUploads(page)`.
- Mostrar `LoadingSpinner` si `isPending`, y el mensaje con `getErrorMessage(error)` si `isError`.
- Pintar una **tabla** con las columnas del enunciado: *Nombre de archivo, Estado (StatusBadge), Fecha de subida, Filas procesadas, Acciones*.
- En *Acciones*, un `<Link href={`/uploads/${upload.id}`}>Ver detalle</Link>`.
- **Paginación** de 10 en 10: botones Anterior/Siguiente; calcula `totalPages = Math.ceil(data.total / data.limit)` y deshabilita los botones en los extremos.
- Si `data.data.length === 0`, mensaje "No hay uploads todavía" con enlace a `/uploads/new`.

**Concepto — renderizar listas:** en lugar de `*ngFor`/`v-for`, usas `.map()` y cada elemento necesita una `key` única:
```tsx
{data.data.map((upload) => (
  <tr key={upload.id}>…</tr>
))}
```

✅ **Comprobación:** en `localhost:3001/uploads` ves los uploads que ya hiciste con Insomnia. En la pestaña *Network*, cada cambio de página lanza una petición con `?page=N`.

---

## Paso 12. Página: Subida de archivo (`/uploads/new`)

Ruta delgada `src/app/uploads/new/page.tsx` que renderiza `<UploadForm />`.

`UploadForm.tsx` (`'use client'`) debe cubrir los requisitos del enunciado:

- Un selector de archivo (`<input type="file" accept=".csv">`) o zona drag & drop.
- **Validación de formato:** solo `.csv`. Comprueba `file.name.toLowerCase().endsWith('.csv')` antes de enviar y muestra un mensaje si no lo es.
- **Indicador de progreso:** estado `const [progress, setProgress] = useState(0)` y pasarlo como `onProgress` a la mutación; una barra cuyo ancho sea `progress%`.
- **Redirección automática al detalle** al terminar:

```tsx
'use client';
import { useRouter } from 'next/navigation';   // ← OJO: next/navigation, NO next/router

const router = useRouter();
const createUpload = useCreateUpload();

createUpload.mutate(
  { file, onProgress: setProgress },
  { onSuccess: (data) => router.push(`/uploads/${data.id}`) },
);
```
- Deshabilitar el botón mientras `createUpload.isPending`, y mostrar `getErrorMessage(createUpload.error)` si falla.

> **Trampa clásica:** `useRouter` existe en dos paquetes. Para el App Router es **`next/navigation`**. El de `next/router` es del sistema antiguo y lanza un error.

**Concepto — eventos y estado:** `onChange={(e) => setFile(e.target.files?.[0] ?? null)}` sustituye a `(change)` en Angular / `@change` en Vue. El estado se actualiza con `setX(...)`, nunca asignando a la variable directamente.

✅ **Comprobación:** subes `docs/sample-data.csv` (o el que tengas), ves el progreso y eres redirigido a `/uploads/<id>` (que aún dará 404 hasta el Paso 13). En Insomnia/`GET /uploads` confirmas que se creó.

---

## Paso 13. Página: Detalle con polling (`/uploads/[id]`)

La carpeta se llama literalmente `[id]` (con corchetes): `src/app/uploads/[id]/page.tsx`.

```tsx
import { UploadDetail } from '@/features/document-processing/components/UploadDetail';

export default function UploadDetailPage() {
  return <UploadDetail />;
}
```

`UploadDetail.tsx` (`'use client'`) obtiene el id con `useParams`:

```tsx
'use client';
import { useParams } from 'next/navigation';

const { id } = useParams<{ id: string }>();
const { data: upload, isPending, isError, error } = useUpload(id);
const results = useUploadResults(id, upload?.status === 'COMPLETED');
```

Debe mostrar (según el enunciado):

| Estado del upload | Qué se ve |
|---|---|
| Cargando | `LoadingSpinner` |
| Cualquiera | Nombre, fecha, `StatusBadge` |
| `PENDING` / `PROCESSING` | Una **barra de progreso** y el texto "Procesando…". El polling ya corre solo gracias a `refetchInterval` |
| `COMPLETED` | Resumen (total/procesadas/fallidas) y una **tabla con los datos** (`results.data`): categoría, cantidad, unidad, fecha |
| `FAILED` | Mensaje claro con `upload.errorMessage` |
| Siempre | Botón "Volver a la lista" (`<Link href="/uploads">`) |

> **Sobre la barra de progreso:** el worker solo escribe `totalRows`/`processedRows` **al terminar** (en `markAsCompleted`), no durante el proceso. Por eso no hay un porcentaje real que calcular mientras está en `PROCESSING`: haz una barra **indeterminada** (animada). Además, con archivos pequeños el estado `PROCESSING` dura milisegundos y quizá nunca lo veas en pantalla; verás `PENDING` → `COMPLETED`. Es normal.

**Concepto — renderizado condicional:** en JSX no hay `*ngIf`/`v-if`; usas `&&`, el operador ternario o `return` anticipado:
```tsx
if (isPending) return <LoadingSpinner />;
if (isError) return <p>{getErrorMessage(error)}</p>;
return (/* … */);
```

✅ **Comprobación:** sube un archivo desde `/uploads/new`: llegas al detalle, ves "Procesando…", y en pocos segundos la página cambia sola a `COMPLETED` y aparece la tabla con las filas. En *Network* ves las peticiones repitiéndose cada 3 s y **dejando de hacerlo** al completarse.

---

## Paso 14. Página: Dashboard (`/`)

Reemplaza el contenido de `src/app/page.tsx` por un componente `Dashboard` (`'use client'`) que use `useUploadsSummary()` y muestre 4 tarjetas:

- Total de uploads → `data.total`
- Completados → `data.completed`
- En proceso → `data.processing` (y opcionalmente `data.pending`)
- Fallidos → `data.failed`

Más un enlace `<Link href="/uploads/new">Crear nuevo upload</Link>`.

Para que las tarjetas se actualicen si hay procesos en curso, puedes añadir `refetchInterval: 5000` al hook del resumen. Y como `useCreateUpload` ya invalida `['uploads']` (que incluye `['uploads','summary']`), el dashboard se refresca solo después de subir algo.

✅ **Comprobación:** los números coinciden con los de `GET /api/v1/uploads/summary` en Insomnia.

---

## Paso 15. Prueba de punta a punta y checklist contra el enunciado

Con backend, worker y frontend corriendo, recorre este flujo como lo haría el evaluador:

1. `/` muestra el resumen.
2. **Crear nuevo upload** → `/uploads/new`.
3. Subir un `.txt` → debe rechazarlo por formato.
4. Subir `sample-data.csv` → barra de progreso → redirección al detalle.
5. El detalle se actualiza solo hasta `COMPLETED` y muestra la tabla con 50 filas.
6. Volver a la lista → el nuevo upload aparece con badge verde y "50" filas procesadas.
7. Con más de 10 uploads, la paginación funciona.
8. `/` muestra los conteos actualizados.

**Checklist del enunciado (Frontend, 20 puntos):**

- [ ] Next.js App Router con navegación correcta (5)
- [ ] React Query con queries básicas (5)
- [ ] UI funcional y usable (5)
- [ ] Polling implementado, se detiene al terminar (5)
- [ ] Badges de color por estado
- [ ] Lista con paginación de 10
- [ ] Detalle con tabla de resultados y mensaje de error en `FAILED`
- [ ] Validación de `.csv` en el formulario

---

## Paso 16. Lo que queda para la entrega

- **`USO-DE-IA.md`** (obligatorio): a medida que avances anota qué generaste con IA, qué corregiste, qué aprendiste (Next.js, React Query, hidratación, CORS...) y qué limitaciones encontraste. Es más fácil escribirlo mientras lo vives que al final.
- **README**: agrega la sección de frontend (`cd frontend && npm install && npm run dev`, puerto 3001, variable `NEXT_PUBLIC_API_URL`).
- **Dockerfile del frontend** (bonus de infraestructura).
- Commits pequeños por paso, con mensajes descriptivos: el enunciado lo valora.

---

## Errores comunes y cómo reconocerlos

| Síntoma | Causa probable |
|---|---|
| `You're importing a component that needs useState... it only works in a Client Component` | Falta `'use client'` en la primera línea del archivo |
| `blocked by CORS policy` en la consola | No hiciste el Paso 4.2 (o no reiniciaste el backend) |
| `Cannot read properties of undefined` con `data.` | Usaste `data` antes de que cargara: revisa `isPending` primero |
| `Hydration failed because the server rendered text didn't match` | Fechas/`Math.random()`/`window` usados al renderizar (Paso 10.3) |
| `NextRouter was not mounted` | Importaste `useRouter` de `next/router` en vez de `next/navigation` |
| `process.env.NEXT_PUBLIC_API_URL` es `undefined` | Falta reiniciar `npm run dev` tras crear `.env.local` |
| La subida da `500` | Bucket o cola de LocalStack inexistentes tras reiniciar Docker |
| El puerto 3000 está ocupado | Se te olvidó `-p 3001` en el script `dev` (Paso 2) |
| El estado se queda en `PENDING` para siempre | El worker (`npm run worker`) no está corriendo |
