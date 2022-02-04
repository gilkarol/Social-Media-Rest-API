import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import messagesRoutes from './routes/messages'
import { Err } from './util/interfaces'

dotenv.config({ path: './.env' })
const app = express()

app.use(bodyparser.json())

app.use('/profile', profileRoutes)
app.use('/auth', authRoutes)
app.use('/messages', messagesRoutes)

app.use((error: Err, req: Request, res: Response, next: NextFunction) => {
	const status: number = error.status || 500
	const message: string = error.message
	res.status(status).json({ message: message })
})

mongoose
	.connect(process.env.DATABASE_LINK as string)
	.then((result) => {
		app.listen(8080)
	})
	.catch((err) => {
		console.log(err)
	})
