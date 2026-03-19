const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/connection');

beforeAll(async () => {
  await pool.query('TRUNCATE TABLE articles');
  await pool.query(`
    INSERT INTO articles (title, content, author, published) VALUES
    ('Node.js Básico',    'Contenido sobre Node.js',  'Ana',    true),
    ('Express Avanzado',  'Contenido sobre Express',  'Carlos', true),
    ('MySQL con Node',    'Contenido sobre MySQL',    'María',  false)
  `);
});

afterAll(async () => {
  await pool.end();
});

// ─── GET /articles ───────────────────────────────────────────────────────────

describe('GET /articles', () => {
  test('devuelve estructura con data y pagination', async () => {
    const res = await request(app).get('/articles');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('pagination tiene page, limit, total y totalPages', async () => {
    const res = await request(app).get('/articles?page=1&limit=10');
    const { pagination } = res.body;
    expect(pagination).toHaveProperty('page', 1);
    expect(pagination).toHaveProperty('limit', 10);
    expect(pagination).toHaveProperty('total');
    expect(pagination).toHaveProperty('totalPages');
  });

  test('?search= filtra por título o contenido', async () => {
    const res = await request(app).get('/articles?search=Node');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((a) => {
      const haystack = (a.title + a.content).toLowerCase();
      expect(haystack).toMatch(/node/);
    });
  });

  test('?search= sin resultados devuelve array vacío', async () => {
    const res = await request(app).get('/articles?search=xyzabc123noexiste');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});

// ─── POST /articles ───────────────────────────────────────────────────────────

describe('POST /articles', () => {
  test('crea un artículo y devuelve 201', async () => {
    const res = await request(app)
      .post('/articles')
      .send({ title: 'Nuevo artículo', content: 'Contenido de prueba', author: 'Test', published: true });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Nuevo artículo');
  });

  test('devuelve 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/articles')
      .send({ title: 'Solo título' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

// ─── GET /articles/:id ────────────────────────────────────────────────────────

describe('GET /articles/:id', () => {
  test('devuelve el artículo correcto', async () => {
    const list = await request(app).get('/articles');
    const id = list.body.data[0].id;
    const res = await request(app).get(`/articles/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  test('devuelve 404 si no existe', async () => {
    const res = await request(app).get('/articles/999999');
    expect(res.status).toBe(404);
  });
});

// ─── PUT /articles/:id ────────────────────────────────────────────────────────

describe('PUT /articles/:id', () => {
  test('actualiza un artículo existente', async () => {
    const list = await request(app).get('/articles');
    const id = list.body.data[0].id;
    const res = await request(app)
      .put(`/articles/${id}`)
      .send({ title: 'Título actualizado', content: 'Contenido actualizado', author: 'Ana', published: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Título actualizado');
  });

  test('devuelve 404 si no existe', async () => {
    const res = await request(app)
      .put('/articles/999999')
      .send({ title: 'X', content: 'Y', author: 'Z', published: false });
    expect(res.status).toBe(404);
  });
});

// ─── DELETE /articles/:id ─────────────────────────────────────────────────────

describe('DELETE /articles/:id', () => {
  test('elimina un artículo existente y devuelve 204', async () => {
    const created = await request(app)
      .post('/articles')
      .send({ title: 'Para borrar', content: 'contenido', author: 'Test', published: false });
    const id = created.body.id;
    const res = await request(app).delete(`/articles/${id}`);
    expect(res.status).toBe(204);
  });

  test('devuelve 404 si no existe', async () => {
    const res = await request(app).delete('/articles/999999');
    expect(res.status).toBe(404);
  });
});
