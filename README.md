# 05 — API CRUD Completa con MySQL

## Objetivo

Conectar la API REST de Express (ejercicio 03) con MySQL (ejercicio 04) para tener una API con persistencia real.

## Contexto

Combinamos lo aprendido: los controladores de Express ahora llaman a las queries de MySQL en lugar de operar sobre arrays en memoria.

## Tareas

### Tarea 1 — Conectar controladores con queries
Adapta `src/controllers/articles.js` para que use las funciones de `src/db/queries.js`.  
Ya no hay datos en memoria: cada operación va a la base de datos.

### Tarea 2 — Manejo correcto de errores async
Envuelve las llamadas async con try/catch y pasa los errores a `next()`.  
Crea un helper `asyncHandler(fn)` en `src/utils/asyncHandler.js` para no repetir el try/catch en cada handler.

### Tarea 3 — Ruta de búsqueda
Añade `GET /articles?search=texto` que busque artículos cuyo título o contenido contengan el texto (con `LIKE`).

### Tarea 4 — Paginación
Añade soporte a `GET /articles?page=1&limit=10` para paginar los resultados.  
La respuesta debe incluir metadatos:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

## Estructura esperada

```
05-mysql-crud-api/
├── src/
│   ├── controllers/
│   │   └── articles.js
│   ├── db/
│   │   ├── connection.js
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   └── queries.js
│   ├── middlewares/
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── articles.js
│   ├── utils/
│   │   └── asyncHandler.js  ← Tarea 2
│   └── app.js
├── tests/
│   ├── articles.test.js
│   └── pagination.test.js
├── .env.example
└── package.json
```

## Cómo empezar

```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm test
npm start
```

## Criterios de evaluación

- [ ] Todos los endpoints CRUD funcionan con persistencia real en MySQL
- [ ] `asyncHandler` elimina la repetición de try/catch
- [ ] La búsqueda por `?search=` funciona con LIKE
- [ ] La paginación devuelve `data` y `pagination` correctamente
- [ ] Los tests pasan
