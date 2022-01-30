import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import { Err } from './util/interfaces'

const app = express()

app.use((error: Err, req: Request, res: Response, next: NextFunction) => {
    const status: number = error.status || 500
    const message: string = error.message
    res.status(status).json({message: message})
})

mongoose.connect(process.env.DATABSE_LINK!)