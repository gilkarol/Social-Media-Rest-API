import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { Err, Req } from '../util/interfaces'

export default (req: Req, res: Response, next: NextFunction) => {
	if (!req.get('Authorization')) {
		const error: Err = new Error('Token is required!')
		error.status = 401
		throw error
	}

	const token = req.get('Authorization')!.split(' ')[1]

	const unhashedToken = jwt.verify(token, process.env.JWT_TOKEN!) as {
		email: string
		userId: number
	}

	if (!unhashedToken.userId) {
		const error: Err = new Error('Not authenticated!')
		error.status = 401
		throw error
	}
	req.userId = unhashedToken.userId
	next()
}
