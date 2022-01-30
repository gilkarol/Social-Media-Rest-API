import { NextFunction, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const signup = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const nickname: string = req.body.nickname
	const password: string = req.body.password

	try {
		const emailExists = await User.findOne({ email: email })
		if (emailExists) {
			const error: Err = new Error('')
			error.status = 409
			throw error
		}
		const hashedPassword = await bcrypt.hash(password, 12)
		const user = new User({
			email: email,
			nickname: nickname,
			password: hashedPassword,
		})
		await user.save()
		res.status(200).json({ message: 'User created successfully!' })
	} catch (err) {
		next(err)
	}
}
