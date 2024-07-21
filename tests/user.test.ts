import { describe, expect, it, jest } from '@jest/globals'
import express, { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import { getUserProfile } from '../src/controllers/user'
import { UserID } from '../src/models/user'

// Функция для создания нового приложения Express с маршрутом и миддлваром
const createApp = (mockAuthMiddleware: boolean) => {
  const app = express()
  app.use(express.json())

  if (mockAuthMiddleware) {
    app.use((req, res, next) => {
      req.user = {
        _id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
      } as UserID
      next()
    })
  } else {
    app.use((req, res, next) => {
      req.user = undefined
      next()
    })
  }

  const router = express.Router()
  router.get('/me', getUserProfile)
  app.use('/api/v2/user', router)

  // Error handler middleware для обработки ошибок
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      statusCode: err.status || 500,
    })
  })

  return app
}

describe('GET /api/v2/user/me', () => {
  it('should return user profile if user is authenticated', async () => {
    const app = createApp(true)

    const response = await request(app).get('/api/v2/user/me')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      success: true,
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
      },
    })
  })

  // it('should return 401 if user is not authenticated', async () => {
  //   const app = createApp(false)
    
  //   const response = await request(app).get('/api/v2/user/me')

  //   expect(response.status).toBe(401)
  //   expect(response.body).toEqual({
  //     success: false,
  //     message: 'Token not found',
  //     statusCode: 401,
  //   })
  // })
})
