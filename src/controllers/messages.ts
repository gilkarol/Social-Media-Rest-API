import { NextFunction, Response } from 'express'

import Message from '../models/message'
import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const getMessages = async (req: Req, res: Response, next: NextFunction) => {
    try {
        const messages = await Message.find()
        res.status(200).json({message: 'Messages found successfully!', messages: messages})
    } catch (err) {
        next(err)
    }
}

export const postMessages = async (req: Req, res: Response, next: NextFunction) => {
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
            creatorNickname: user.nickname
        })
        await message.save()
        await user.messages.push(message)
        await user.save()
        res.status(201).json({message: 'Message has been posted successfully!'})
    } catch (err) {
        next(err)
    }
}