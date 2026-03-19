const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/connection');

beforeAll(async () => {
  await pool.query('TRUNCATE TABLE articles');
  // Insertar 25 artículos para probar paginación
  const values = Array.from({ length: 25 }, (_, i) =>
    `('Artículo ${i + 1}', 'Contenido del artículo ${i + 1}', 'Autor', true)`
  ).join(', ');
  await pool.query(`INSERT INTO articles (title, content, author, published) VALUES ${values}`);
});

afterAll(async () => {
  await pool.end();
});

describe('Paginación', () => {
  test('respeta el parámetro limit', async () => {
    const res = await request(app).get('/articles?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    expect(res.body.pagination.limit).toBe(5);
  });

  test('page y totalPages son correctos', async () => {
    const res = await request(app).get('/articles?page=1&limit=10');
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.total).toBe(25);
    expect(res.body.pagination.totalPages).toBe(3);
  });

  test('la segunda página devuelve artículos distintos a la primera', async () => {
    const page1 = await request(app).get('/articles?page=1&limit=10');
    const page2 = await request(app).get('/articles?page=2&limit=10');
    const ids1 = page1.body.data.map((a) => a.id);
    const ids2 = page2.body.data.map((a) => a.id);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  test('la última página tiene los artículos restantes', async () => {
    const res = await request(app).get('/articles?page=3&limit=10');
    expect(res.body.data.length).toBe(5); // 25 - 10 - 10 = 5
  });

  test('limit por defecto es 10', async () => {
    const res = await request(app).get('/articles');
    expect(res.body.pagination.limit).toBe(10);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });
});
