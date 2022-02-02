import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const signup = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const nickname: string = req.body.nickname
	const password: string = req.body.password

	try {
		const emailExists = await User.findOne({ email: email })
		const nicknameExists = await User.findOne({ nickname: nickname })
		if (emailExists || nicknameExists) {
			const error: Err = new Error('This email or nickname already exists!')
			error.status = 409
			throw error
		}
		const hashedPassword: string = await bcrypt.hash(password, 12)
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

export const login = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const password: string = req.body.password

	try {
		const user = await User.findOne({ email: email })
		if (!user) {
			const error: Err = new Error('User does not exist!')
			error.status = 404
			throw error
		}
		const isEqual: boolean = await bcrypt.compare(password, user.password)
		if (!isEqual) {
			const error: Err = new Error('Password does not match!')
			error.status = 409
			throw error
		}
		const token = jwt.sign(
			{ email: email, userId: user._id },
			process.env.JWT_TOKEN!, {expiresIn: '1h'}
		)
		res
			.status(200)
			.json({ message: 'User logged in successfully!', token: token })
	} catch (err) {
		next(err)
	}
}
