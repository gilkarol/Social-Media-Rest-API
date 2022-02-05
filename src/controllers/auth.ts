import { NextFunction, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Err } from '../util/classes'
import { Req } from '../util/interfaces'
import User from '../models/user'
import Profile from '../models/profile'

export const signup = async (req: Req, res: Response, next: NextFunction) => {
	const email: string = req.body.email
	const nickname: string = req.body.nickname
	const password: string = req.body.password
	try {
		const emailExists = await User.findOne({ email: email.toString() })
		const nicknameExists = await Profile.findOne({ nickname: nickname })

		if (emailExists) throw new Err(409, 'This email already exists!')
		if (nicknameExists) throw new Err(409, 'This nickname is already taken!')

		const hashedPassword: string = await bcrypt.hash(password, 12)
		const user = new User({
			email: email,
			password: hashedPassword
		})
		const profile = new Profile({
			user: user,
			nickname: nickname
		})
		user.profile = profile
		await user.save()
		await profile.save()
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
		if (!user) throw new Err(404, 'User does not exist!')

		const isEqual: boolean = await bcrypt.compare(password, user.password)
		if (!isEqual) throw new Err(409, 'Password does not match!')

		const token = jwt.sign(
			{ email: email, userId: user._id, profileId: user.profile._id },
			process.env.JWT_TOKEN!,
			{ expiresIn: '1h' }
		)
		res
			.status(200)
			.json({ message: 'User logged in successfully!', token: token })
	} catch (err) {
		next(err)
	}
}
