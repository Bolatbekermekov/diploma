import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import 'dotenv/config'
import express from 'express'
import { errorMiddleware } from './src/middlewares/error'
import user from './src/routes/user'
config({
	path: './.env',
})
export const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] }))

app.use('/api/v2/user', user)

app.use(errorMiddleware)

app.use((req, res, err) => {
	console.error(err)
	res.status(500).send('Something broke!')
})
