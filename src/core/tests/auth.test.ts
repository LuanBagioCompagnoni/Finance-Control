import request from 'supertest'
import { app } from '../src/app'
import { describe, it, expect } from 'vitest'

describe('POST /api/auth/register', () => {
  it('creates a user and returns a JWT cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan', email: 'luan@test.com', password: 'senha123' })

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('luan@test.com')
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toContain('auth-token')
  })

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan', email: 'dup@test.com', password: 'senha123' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan2', email: 'dup@test.com', password: 'outra123' })

    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/login', () => {
  it('returns JWT cookie on valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan', email: 'login@test.com', password: 'senha123' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'senha123' })

    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('rejects wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan', email: 'wrong@test.com', password: 'certa123' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'errada' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('returns user when authenticated', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Luan', email: 'me@test.com', password: 'senha123' })

    const cookie = reg.headers['set-cookie'][0]

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('me@test.com')
  })

  it('returns 401 without cookie', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
