import request from 'supertest'
import { app } from '../src/app'
import { describe, it, expect, beforeEach } from 'vitest'

let cookie: string

beforeEach(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Luan', email: 'luan@test.com', password: 'senha123' })
  cookie = res.headers['set-cookie'][0]
})

describe('GET /api/categories', () => {
  it('returns seed categories after registration', async () => {
    const res = await request(app).get('/api/categories').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    const names = res.body.map((c: { name: string }) => c.name)
    expect(names).toContain('Salário')
    expect(names).toContain('Transporte')
  })

  it('filters by type', async () => {
    const res = await request(app).get('/api/categories?type=INCOME').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.every((c: { type: string }) => c.type === 'INCOME')).toBe(true)
  })
})

describe('POST /api/categories', () => {
  it('creates a custom category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: 'Gasolina', type: 'EXPENSE', costType: 'VARIABLE', color: '#f97316', icon: 'fuel' })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Gasolina')
  })
})

describe('PUT /api/categories/:id', () => {
  it('updates a category', async () => {
    const create = await request(app)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: 'Temp', type: 'EXPENSE', costType: 'VARIABLE', color: '#000', icon: 'x' })

    const res = await request(app)
      .put(`/api/categories/${create.body._id}`)
      .set('Cookie', cookie)
      .send({ name: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated')
  })
})

describe('DELETE /api/categories/:id', () => {
  it('deletes a user category', async () => {
    const create = await request(app)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: 'Temp', type: 'EXPENSE', costType: 'VARIABLE', color: '#000', icon: 'x' })

    const res = await request(app)
      .delete(`/api/categories/${create.body._id}`)
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
  })
})

describe('PUT /api/categories/:id (not found)', () => {
  it('returns 404 for non-existent category', async () => {
    const res = await request(app)
      .put('/api/categories/000000000000000000000001')
      .set('Cookie', cookie)
      .send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/categories/:id (not found)', () => {
  it('returns 404 for non-existent category', async () => {
    const res = await request(app)
      .delete('/api/categories/000000000000000000000001')
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })
})

describe('POST /api/categories (validation)', () => {
  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: 'Bad' }) // missing type and costType
    expect(res.status).toBe(400)
  })
})

describe('GET /api/categories (unauthenticated)', () => {
  it('returns 401 without cookie', async () => {
    const res = await request(app).get('/api/categories')
    expect(res.status).toBe(401)
  })
})
