import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

export default (req: Req, res: Response, next: NextFunction) => {
	if (!req.get('Authorization')) throw new Err(401, 'Token is required!') 

	const token = req.get('Authorization')!.split(' ')[1]

	const unhashedToken = jwt.verify(token, process.env.JWT_TOKEN!) as {
		email: string
		userId: string
		profileId: string
	}
	if (!unhashedToken.userId) throw new Err(401, 'Not authenticated!')

	req.userId = unhashedToken.userId!
	req.profileId = unhashedToken.profileId!
	next()
}
