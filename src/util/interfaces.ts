import { Request } from 'express'

export interface Err extends Error {
	status?: number
}

export interface Req extends Request {
	userId: number
}
