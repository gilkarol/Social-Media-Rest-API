import { Router } from 'express'

import { body } from 'express-validator'

import { signup, login } from '../controllers/auth'

const router = Router()

router.post(
	'/signup',
	[
		body('email')
			.trim()
			.isEmail()
			.withMessage('This email is not correct!')
			.not()
			.isEmpty(),
		body('password')
			.trim()
			.isLength({ min: 5 })
			.withMessage('Password should be at least 5 characters long!'),
	],
	signup
)

router.post(
	'/login',
	[
		body('email')
			.trim()
			.isEmail()
			.withMessage('This email is not correct!')
			.not()
			.isEmpty(),
		body('password')
			.trim()
			.isLength({ min: 5 })
			.withMessage('Password should be at least 5 characters long!'),
	],
	login
)

export default router
