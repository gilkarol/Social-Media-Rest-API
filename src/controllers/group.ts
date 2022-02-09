import { NextFunction, Response } from 'express'

import Group from '../models/group'
import Profile from '../models/profile'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

// --------------------------- MEMBER ---------------------------

export const getGroupPosts = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const groupId: string = req.params.groupId!
	const profileId: string = req.profileId!
	try {
		const group = await Group.findById(groupId)
		if (!group) throw new Err(404, 'Group has not been found!')
		if (group.participants.indexOf(profileId) == -1)
			throw new Err(409, 'You are not member of the group!')
		const posts = group.posts

		res
			.status(200)
			.json({ message: 'Posts has been found successfully!', posts: posts })
	} catch (err) {
		next(err)
	}
}

export const getGroupChat = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const groupId: string = req.params.groupId!
	const profileId: string = req.profileId!
	try {
		const group = await Group.findById(groupId)
		if (!group) throw new Err(404, 'Group has not been found!')
		if (group.participants.indexOf(profileId) == -1)
			throw new Err(409, 'You are not member of the group!')
		const chat = group.chat

		res
			.status(200)
			.json({ message: 'Chat has been found successfully!', chat: chat })
	} catch (err) {
		next(err)
	}
}

export const postRequestToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.profileId!
	const groupId: string = req.params.groupId

	try {
		const group = await Group.findById(groupId)
		const profile = await Profile.findById(profileId)
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.participants.indexOf(profileId) >= 0) throw new Err(409, 'You are already member of this group!')
		group.joinRequests.push(profile)
		profile.requestsToJoinGroups.push(group)
		await group.save()
		await profile.save()
	} catch (err) {
		next (err)
	}
}


// --------------------------- ADMIN ---------------------------