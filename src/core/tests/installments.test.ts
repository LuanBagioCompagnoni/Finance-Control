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
    .send({ name: 'Nubank CC', bank: 'Nubank', type: 'credit', color: '#8b5cf6', initialBalance: 5000 })
  accountId = acc.body._id

  const cats = await request(app).get('/api/categories?type=EXPENSE').set('Cookie', cookie)
  categoryId = cats.body[0]._id
})

describe('POST /api/installments', () => {
  it('creates installment group and generates N transactions', async () => {
    const res = await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'Notebook',
        totalAmount: 3000,
        installmentCount: 10,
        startDate: '2026-01-01',
      })

    expect(res.status).toBe(201)
    expect(res.body.group.installmentCount).toBe(10)
    expect(res.body.group.installmentAmount).toBe(300)
    expect(res.body.transactionsCreated).toBe(10)
  })

  it('decreases account balance by total amount', async () => {
    await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'TV',
        totalAmount: 1200,
        installmentCount: 4,
        startDate: '2026-01-01',
      })

    const accounts = await request(app).get('/api/accounts').set('Cookie', cookie)
    const account = accounts.body.find((a: { _id: string }) => a._id === accountId)
    expect(account.balance).toBe(3800) // 5000 - 1200
  })

  it('generates transactions on correct months', async () => {
    await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'TV',
        totalAmount: 2400,
        installmentCount: 4,
        startDate: '2026-05-01',
      })

    const txRes = await request(app).get('/api/transactions').set('Cookie', cookie)
    const txDates = txRes.body.data.map((tx: { date: string }) => new Date(tx.date).getUTCMonth())
    expect(txDates).toContain(4)  // May = 4
    expect(txDates).toContain(5)  // Jun = 5
    expect(txDates).toContain(6)  // Jul = 6
    expect(txDates).toContain(7)  // Aug = 7
  })

  it('returns 400 for installmentCount less than 2', async () => {
    const res = await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'Test',
        totalAmount: 100,
        installmentCount: 1,
        startDate: '2026-01-01',
      })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/installments', () => {
  it('returns installment groups', async () => {
    await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'Geladeira',
        totalAmount: 2400,
        installmentCount: 6,
        startDate: '2026-01-01',
      })

    const res = await request(app).get('/api/installments').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].description).toBe('Geladeira')
  })
})

describe('DELETE /api/installments/:id', () => {
  it('removes group and all associated transactions', async () => {
    const create = await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'Celular',
        totalAmount: 1200,
        installmentCount: 3,
        startDate: '2026-05-01',
      })

    await request(app)
      .delete(`/api/installments/${create.body.group._id}`)
      .set('Cookie', cookie)

    const txRes = await request(app).get('/api/transactions').set('Cookie', cookie)
    expect(txRes.body.data.length).toBe(0)
  })

  it('restores account balance on delete', async () => {
    const create = await request(app)
      .post('/api/installments')
      .set('Cookie', cookie)
      .send({
        creditCardAccountId: accountId,
        categoryId,
        description: 'Micro-ondas',
        totalAmount: 900,
        installmentCount: 3,
        startDate: '2026-05-01',
      })

    await request(app)
      .delete(`/api/installments/${create.body.group._id}`)
      .set('Cookie', cookie)

    const accounts = await request(app).get('/api/accounts').set('Cookie', cookie)
    const account = accounts.body.find((a: { _id: string }) => a._id === accountId)
    expect(account.balance).toBe(5000) // back to initial
  })

  it('returns 404 for non-existent group', async () => {
    const res = await request(app)
      .delete('/api/installments/000000000000000000000001')
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })
})
