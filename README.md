# 05 — API CRUD Completa con MySQL

## Objetivo

Conectar la API REST de Express (ejercicio 03) con MySQL (ejercicio 04) para tener una API con persistencia real en base de datos.

## Contexto

Combinamos lo aprendido: los controladores de Express ahora llaman a las queries de MySQL en lugar de operar sobre arrays en memoria.

El scaffold ya incluye la estructura completa con rutas, middlewares y scripts de base de datos. Tu trabajo es implementar los **TODO** en tres archivos:

| Archivo | Qué implementar |
|---|---|
| `src/utils/asyncHandler.js` | Tarea 2 — wrapper de try/catch |
| `src/db/queries.js` | Tareas 1, 3 y 4 — queries SQL |
| `src/controllers/articles.js` | Tareas 1, 3 y 4 — lógica de cada endpoint |

---

## Prerrequisitos

- Node.js 18+
- MySQL 8 corriendo en local (o Docker)

Si usas Docker, puedes levantar MySQL con:

```bash
docker run -d \
  --name mysql-articles \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=articles_db \
  -p 3306:3306 \
  mysql:8
```

---

## Cómo empezar

```bash
# 1. Copia las variables de entorno y edítalas con tus credenciales de MySQL
cp .env.example .env

# 2. Instala dependencias
npm install

# 3. Crea la tabla en la base de datos
npm run migrate

# 4. Inserta los datos de ejemplo
npm run seed

# 5. Ejecuta los tests (todos deben fallar al principio)
npm test

# 6. Cuando hayas implementado los TODO, arranca el servidor
npm start
```

---

## Tareas

### Tarea 1 — Conectar controladores con queries

Implementa las funciones en `src/db/queries.js`:

- `getAllArticles()` → `SELECT * FROM articles` (sin búsqueda ni paginación de momento)
- `getArticleById(id)` → devuelve el artículo o `null`
- `createArticle(data)` → inserta y devuelve el artículo creado con su `id`
- `updateArticle(id, data)` → actualiza y devuelve el artículo o `null` si no existía
- `deleteArticle(id)` → elimina y devuelve `true` o `false`

Luego conecta estos métodos en `src/controllers/articles.js` (cada función tiene su TODO con instrucciones).

### Tarea 2 — `asyncHandler`

Implementa el helper en `src/utils/asyncHandler.js`.

Debe envolver cualquier handler async de Express para que los errores lleguen automáticamente a `next()`, sin tener que escribir try/catch en cada controlador.

```js
// Uso esperado:
const handler = asyncHandler(async (req, res) => {
  // si esto lanza un error, Express lo captura solo
  const data = await algunaOperacionAsync();
  res.json(data);
});
```

### Tarea 3 — Búsqueda

Añade soporte a `GET /articles?search=texto`.

En `getAllArticles()` filtra los resultados cuyo `title` o `content` contengan el texto usando `LIKE`:

```sql
WHERE title LIKE ? OR content LIKE ?
-- con el valor: `%texto%`
```

### Tarea 4 — Paginación

Añade soporte a `GET /articles?page=1&limit=10`.

La respuesta debe tener esta estructura:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

En `getAllArticles()` usa `LIMIT` y `OFFSET` (`OFFSET = (page - 1) * limit`).
Necesitarás dos queries: una para los datos y otra para el `COUNT(*)` total.

---

## Estructura del proyecto

```
05-mysql-crud-api/
├── data/
│   └── articles.json           ← datos de ejemplo para el seed
├── src/
│   ├── controllers/
│   │   └── articles.js         ← ✏️  TODO (Tareas 1, 3 y 4)
│   ├── db/
│   │   ├── connection.js       ← pool de MySQL (ya implementado)
│   │   ├── migrate.js          ← crea la tabla (ya implementado)
│   │   ├── seed.js             ← inserta datos de ejemplo (ya implementado)
│   │   └── queries.js          ← ✏️  TODO (Tareas 1, 3 y 4)
│   ├── middlewares/
│   │   ├── validate.js         ← valida campos obligatorios (ya implementado)
│   │   └── errorHandler.js     ← manejo global de errores (ya implementado)
│   ├── routes/
│   │   └── articles.js         ← rutas REST (ya implementado)
│   ├── utils/
│   │   └── asyncHandler.js     ← ✏️  TODO (Tarea 2)
│   └── app.js                  ← app Express (ya implementado)
├── tests/
│   ├── articles.test.js        ← tests de los endpoints CRUD
│   └── pagination.test.js      ← tests de paginación
├── .env.example
└── package.json
```

---

## Criterios de evaluación

- [ ] Todos los endpoints CRUD funcionan con persistencia real en MySQL
- [ ] `asyncHandler` elimina la repetición de try/catch
- [ ] La búsqueda por `?search=` funciona con LIKE
- [ ] La paginación devuelve `data` y `pagination` correctamente
- [ ] Los tests pasan (`npm test`)

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/articles` | Lista todos los artículos (soporta `?search=` y `?page=&limit=`) |
| GET | `/articles/:id` | Obtiene un artículo por ID |
| POST | `/articles` | Crea un nuevo artículo |
| PUT | `/articles/:id` | Actualiza un artículo existente |
| DELETE | `/articles/:id` | Elimina un artículo |

### Ejemplo: crear un artículo

```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi artículo","content":"Contenido...","author":"Ana","published":true}'
```

### Ejemplo: buscar con paginación

```bash
curl "http://localhost:3000/articles?search=Node&page=1&limit=5"
```
