import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'

import authRoutes from './routes/auth'
import messagesRoutes from './routes/messages'
import { Err } from './util/interfaces'

const app = express()

app.use(bodyparser.json())

app.use(authRoutes)
app.use(messagesRoutes)

app.use((error: Err, req: Request, res: Response, next: NextFunction) => {
	const status: number = error.status || 500
	const message: string = error.message
	res.status(status).json({ message: message })
})

mongoose.connect(process.env.DATABSE_LINK!)
