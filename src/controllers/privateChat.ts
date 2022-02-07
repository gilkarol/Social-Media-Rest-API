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

    const text: string = req.body.text

	try {
		const chat = await PrivateChat.findOne({
			participants: { profileId, loggedProfileId },
		})
        if (!chat) throw new Err(404, 'This chat does not exist!')
        const message = new Message({
            profile: loggedProfileId,
            message: text
        })
        chat.messages.push(message)
        await chat.save()
		res.status(200).json({message: 'Message has been send successfully!'})
	} catch (err) {
		next(err)
	}
}
