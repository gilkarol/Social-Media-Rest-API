import { NextFunction, Response } from 'express'
import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const getProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId = req.params.userId

	try {
		const user = await User.findById(userId)
		if (!user) {
			const error: Err = new Error('This user doest not exist!')
			error.status = 404
			throw error
		}
		res.status(200).json({ message: 'User has been found!', user: user })
	} catch (err) {
		next(err)
	}
}
