import { NextFunction, Response } from 'express'

import User from '../models/user'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

export const getProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: string = req.userId!
	const profileUserId: string = req.params.profileUserId

	try {
		const user = await User.findById(userId)
		if (!user) throw new Err(404, 'This user does not exist!')

		res
			.status(200)
			.json({
				message: 'User has been found!',
				user: user,
				isSameUser: userId.toString() === profileUserId.toString(),

			})
	} catch (err) {
		next(err)
	}
}

export const postInviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: string = req.userId!
	const profileUserId: string = req.params.profileUserId

	try {
	} catch (err) {
		next(err)
	}
}
