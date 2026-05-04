import request from 'supertest'
import { app } from '../src/app'
import { describe, it, expect, beforeEach } from 'vitest'

let cookie: string
let accountId: string
let categoryId: string

beforeEach(async () => {
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Luan', email: 'luan@test.com', password: 'senha123' })
  cookie = reg.headers['set-cookie'][0]

  const acc = await request(app)
    .post('/api/accounts')
    .set('Cookie', cookie)
    .send({ name: 'Nubank', bank: 'Nubank', type: 'checking', color: '#8b5cf6', initialBalance: 1000 })
  accountId = acc.body._id

  const cats = await request(app).get('/api/categories').set('Cookie', cookie)
  categoryId = cats.body.find((c: { type: string }) => c.type === 'EXPENSE')._id
})

describe('POST /api/transactions (EXPENSE)', () => {
  it('creates an expense and decreases account balance', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', cookie)
      .send({ accountId, categoryId, date: '2026-05-01', amount: 200, type: 'EXPENSE', description: 'Mercado' })

    expect(res.status).toBe(201)
    expect(res.body.amount).toBe(200)

    const accounts = await request(app).get('/api/accounts').set('Cookie', cookie)
    expect(accounts.body.find((a: { _id: string; balance: number }) => a._id === accountId).balance).toBe(800)
  })
})

describe('POST /api/transactions (INCOME)', () => {
  it('creates an income and increases account balance', async () => {
    const incomeCatRes = await request(app).get('/api/categories?type=INCOME').set('Cookie', cookie)
    const incomeCatId = incomeCatRes.body[0]._id

    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', cookie)
      .send({ accountId, categoryId: incomeCatId, date: '2026-05-01', amount: 4000, type: 'INCOME', description: 'Salário' })

    expect(res.status).toBe(201)

    const accounts = await request(app).get('/api/accounts').set('Cookie', cookie)
    expect(accounts.body.find((a: { _id: string; balance: number }) => a._id === accountId).balance).toBe(5000)
  })
})

describe('DELETE /api/transactions/:id', () => {
  it('reverts account balance on delete', async () => {
    const tx = await request(app)
      .post('/api/transactions')
      .set('Cookie', cookie)
      .send({ accountId, categoryId, date: '2026-05-01', amount: 300, type: 'EXPENSE', description: 'Gasolina' })

    await request(app).delete(`/api/transactions/${tx.body._id}`).set('Cookie', cookie)

    const accounts = await request(app).get('/api/accounts').set('Cookie', cookie)
    expect(accounts.body.find((a: { _id: string; balance: number }) => a._id === accountId).balance).toBe(1000)
  })
})

describe('GET /api/transactions', () => {
  it('returns transactions with filters', async () => {
    await request(app)
      .post('/api/transactions')
      .set('Cookie', cookie)
      .send({ accountId, categoryId, date: '2026-05-01', amount: 100, type: 'EXPENSE', description: 'Test' })

    const res = await request(app).get('/api/transactions').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
  })
})
