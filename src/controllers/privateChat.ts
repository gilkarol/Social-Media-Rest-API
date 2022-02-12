import { NextFunction, Response } from 'express'
import Message from '../models/message'
import PrivateChat from '../models/privateChat'
import { Err } from '../util/classes'

import { Req } from '../util/interfaces'

export const getChat = async (req: Req, res: Response, next: NextFunction) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		const chat = await PrivateChat.findOne({
			participants: { profileId, loggedProfileId },
			groupChat: false
		})
		res.status(200).json({ message: 'Found chat successfully!', chat: chat })
	} catch (err) {
		next(err)
	}
}

export const postMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	console.log(profileId)
	console.log(loggedProfileId)

	const text: string = req.body.text

	try {
		const chat = await PrivateChat.findOne({
			participants: loggedProfileId && profileId,
		})
		if (!chat) throw new Err(404, 'This chat does not exist!')
		const message = new Message({
			profileCreator: loggedProfileId,
			message: text,
			messageToProfile: profileId,
		})
		chat.messages.push(message)
		await message.save()
		await chat.save()
		res.status(201).json({ message: 'Message has been send successfully!' })
	} catch (err) {
		next(err)
	}
}

export const patchMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const loggedProfileId: string = req.profileId!
	const messageId: string = req.params.messageId

	const text: string = req.body.text

	try {
		const message = await Message.findById(messageId)
		if (!message) throw new Err(404, 'This message does not exist!')
		if (message.profile.toString() !== loggedProfileId.toString())
			throw new Err(401, 'This user is not the creator of message!')
		message.update({ message: text })
		await message.save()
		res.status(200).json({ message: 'Message updated successfully!' })
	} catch (err) {
		next(err)
	}
}

export const deleteMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const loggedProfileId: string = req.profileId!
	const messageId: string = req.params.messageId

	try {
		const message = await Message.findById(messageId)
		const chat = await PrivateChat.findOne({ messages: message })
		if (!chat) throw new Err(404, 'Chat not found!')
		if (message.profile.toString() !== loggedProfileId.toString())
			throw new Err(401, 'This user is not the creator of message!')

		chat.messages.pull(message)
		await message.delete()
		await chat.save()
		res.status(200).json({ message: 'Message has been deleted successfully!' })
	} catch (err) {
		next(err)
	}
}
