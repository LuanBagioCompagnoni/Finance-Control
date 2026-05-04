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

describe('GET /api/accounts', () => {
  it('returns empty array initially', async () => {
    const res = await request(app).get('/api/accounts').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/accounts', () => {
  it('creates an account with initial balance', async () => {
    const res = await request(app)
      .post('/api/accounts')
      .set('Cookie', cookie)
      .send({ name: 'Nubank', bank: 'Nubank', type: 'checking', color: '#8b5cf6', initialBalance: 1500 })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Nubank')
    expect(res.body.balance).toBe(1500)
  })

  it('requires authentication', async () => {
    const res = await request(app)
      .post('/api/accounts')
      .send({ name: 'Nubank', bank: 'Nubank', type: 'checking', color: '#8b5cf6', initialBalance: 0 })
    expect(res.status).toBe(401)
  })
})

describe('PUT /api/accounts/:id', () => {
  it('updates account name', async () => {
    const create = await request(app)
      .post('/api/accounts')
      .set('Cookie', cookie)
      .send({ name: 'Sicoob', bank: 'Sicoob', type: 'checking', color: '#22c55e', initialBalance: 0 })

    const res = await request(app)
      .put(`/api/accounts/${create.body._id}`)
      .set('Cookie', cookie)
      .send({ name: 'Sicoob CC' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Sicoob CC')
    expect(res.body.bank).toBe('Sicoob')
    expect(res.body.balance).toBe(0)
  })
})

describe('DELETE /api/accounts/:id', () => {
  it('deletes account without transactions', async () => {
    const create = await request(app)
      .post('/api/accounts')
      .set('Cookie', cookie)
      .send({ name: 'Temp', bank: 'Banco', type: 'checking', color: '#6b7280', initialBalance: 0 })

    const res = await request(app)
      .delete(`/api/accounts/${create.body._id}`)
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
  })
})
