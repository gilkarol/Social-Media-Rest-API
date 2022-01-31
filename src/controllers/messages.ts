import { NextFunction, Response } from 'express'

import Message from '../models/message'
import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const getMessages = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	try {
		const messages = await Message.find()
		res
			.status(200)
			.json({ message: 'Messages found successfully!', messages: messages })
	} catch (err) {
		next(err)
	}
}

export const postMessages = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: number = req.userId!
	const text: string = req.body.text

	try {
		const user = await User.findById(userId)
		if (!user) {
			const error: Err = new Error('User is not authenticated!')
			error.status = 401
			throw error
		}
		const message = new Message({
			message: text,
			creatorId: userId,
			creatorNickname: user.nickname,
		})
		await message.save()
		await user.messages.push(message)
		await user.save()
		res.status(201).json({ message: 'Message has been posted successfully!' })
	} catch (err) {
		next(err)
	}
}

export const patchMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: number = req.userId!
	const messageId: string = req.params.messageId
	const text: string = req.body.text

	try {
		const message = await Message.findOne({ _id: messageId })
		if (!message) {
			const error: Err = new Error('Message ID is wrong!')
			error.status = 404
			throw error
		}
		if (message.creatorId.toString() !== userId.toString()) {
			const error: Err = new Error('This user is not the creator of message!')
			error.status = 409
			throw error
		}
		await Message.findByIdAndUpdate(messageId, {
			message: text,
		})
		res.status(200).json({ message: 'Message has been updated successfully!' })
	} catch (err) {
		next(err)
	}
}

export const deleteMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: number = req.userId!
	const messageId: string = req.params.messageId

	try {
		const message = await Message.findOne({ _id: messageId })
		const user = await User.findById(userId)
        if (!message) {
            const error: Err = new Error('Message has not been found!')
			error.status = 404
			throw error
        }
		if (!user) {
			const error: Err = new Error('User is not authenticated!')
			error.status = 401
			throw error
		}
		if (message.creatorId.toString() != userId.toString()) {
			const error: Err = new Error('This user is not the creator of message!')
			error.status = 409
			throw error
		}
		await Message.findByIdAndDelete(messageId)
		await user.messages.pull(message)
        await user.save()
		res.status(200).json({ message: 'Message has been deleted successfully!' })
	} catch (err) {
		next(err)
	}
}
