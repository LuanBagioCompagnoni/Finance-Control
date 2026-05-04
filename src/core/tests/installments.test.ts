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
    .send({ name: 'Nubank CC', bank: 'Nubank', type: 'credit', color: '#8b5cf6', initialBalance: 0 })
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
    const txDates = txRes.body.data.map((tx: { date: string }) => new Date(tx.date).getMonth())
    expect(txDates).toContain(4)  // May = 4
    expect(txDates).toContain(5)  // Jun = 5
    expect(txDates).toContain(6)  // Jul = 6
    expect(txDates).toContain(7)  // Aug = 7
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
})
