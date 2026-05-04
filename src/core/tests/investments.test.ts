import request from 'supertest'
import { app } from '../src/app'
import { describe, it, expect, beforeEach } from 'vitest'

let cookie: string
let accountId: string

beforeEach(async () => {
  const reg = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Luan', email: 'luan@test.com', password: 'senha123' })
  cookie = reg.headers['set-cookie'][0]

  const acc = await request(app)
    .post('/api/accounts')
    .set('Cookie', cookie)
    .send({ name: 'Sicoob', bank: 'Sicoob', type: 'investment', color: '#22c55e', initialBalance: 5000 })
  accountId = acc.body._id
})

describe('POST /api/investments', () => {
  it('creates an investment entry', async () => {
    const res = await request(app)
      .post('/api/investments')
      .set('Cookie', cookie)
      .send({ accountId, date: '2026-05-01', amount: 1000, type: 'ETF', assetName: 'IVVB11' })

    expect(res.status).toBe(201)
    expect(res.body.assetName).toBe('IVVB11')
    expect(res.body.type).toBe('ETF')
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/investments')
      .set('Cookie', cookie)
      .send({ accountId })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/investments', () => {
  it('returns investment entries', async () => {
    await request(app)
      .post('/api/investments')
      .set('Cookie', cookie)
      .send({ accountId, date: '2026-05-01', amount: 500, type: 'ACAO', assetName: 'GGBR4' })

    const res = await request(app).get('/api/investments').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('filters by type', async () => {
    await request(app).post('/api/investments').set('Cookie', cookie)
      .send({ accountId, date: '2026-05-01', amount: 200, type: 'CDB', assetName: 'CDB Nubank' })
    await request(app).post('/api/investments').set('Cookie', cookie)
      .send({ accountId, date: '2026-05-01', amount: 200, type: 'ETF', assetName: 'IVVB11' })

    const res = await request(app).get('/api/investments?type=CDB').set('Cookie', cookie)
    expect(res.body.length).toBe(1)
    expect(res.body[0].type).toBe('CDB')
  })
})

describe('DELETE /api/investments/:id', () => {
  it('deletes an investment entry', async () => {
    const create = await request(app)
      .post('/api/investments')
      .set('Cookie', cookie)
      .send({ accountId, date: '2026-05-01', amount: 300, type: 'FII', assetName: 'HGLG11' })

    const res = await request(app)
      .delete(`/api/investments/${create.body._id}`)
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
  })

  it('returns 404 for non-existent entry', async () => {
    const res = await request(app)
      .delete('/api/investments/000000000000000000000001')
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })
})
