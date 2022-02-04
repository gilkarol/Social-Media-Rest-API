import { NextFunction, Response } from 'express'

import Message from '../models/message'
import User from '../models/user'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

export const getMessages = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	try {
		const messages = await Message.find()
		if (messages.length == 0) {
			return res
				.status(200)
				.json({ message: 'There are no messages!', messages: [] })
		}
		res
			.status(200)
			.json({ message: 'Messages found successfully!', messages: messages })
	} catch (err) {
		next(err)
	}
}

export const getMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const messageId: string = req.params.messageId
	try {
		const message = await Message.findById(messageId)
		if (!message) throw new Err(404, 'Message has not been found!')

		res.status(200).json({
			message: 'Message has been found successfully!',
			singleMessage: message,
		})
	} catch (err) {
		next(err)
	}
}

export const getUserMessages = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const nickname = req.params.nickname
	try {
		const userMessages = await Message.find({ creatorNickname: nickname })
		if (userMessages.length == 0) {
			return res
				.status(201)
				.json({ message: 'User has no messages!', messages: [] })
		}
		res
			.status(200)
			.json({ message: 'Messages found successfully!', messages: userMessages })
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
		if (!user) throw new Err(401, 'User is not authenticated!')

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
		if (!message) throw new Err(404, 'Message ID is wrong!')

		if (message.creatorId.toString() !== userId.toString())
			throw new Err(409, 'This user is not the creator of message!')

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
		
		if (!message) throw new Err(404, 'Message has not been found!') 
		if (!user) throw new Err(401, 'User is not authenticated!')  
		if (message.creatorId.toString() != userId.toString()) throw new Err(409, 'This user is not the creator of message!') 

		await Message.findByIdAndDelete(messageId)
		await user.messages.pull(message)
		await user.save()
		res.status(200).json({ message: 'Message has been deleted successfully!' })
	} catch (err) {
		next(err)
	}
}
