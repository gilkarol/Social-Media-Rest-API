import { NextFunction, Response } from 'express'

import Group from '../models/group'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

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
		if (group.particpants.indexOf(profileId) == -1)
			throw new Err(409, 'You are not member of the group!')
		const posts = group.posts

		res
			.status(200)
			.json({ message: 'Posts has been found successfully!', posts: posts })
	} catch (err) {
		next(err)
	}
}
