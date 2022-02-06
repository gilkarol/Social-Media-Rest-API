import { NextFunction, Response } from 'express'

import Post from '../models/post'
import Profile from '../models/profile'
import { Req } from '../util/interfaces'

export const getFriendsPosts = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const postPost = async (req: Req, res: Response, next: NextFunction) => {
	const text = req.body.text
	const profileId = req.profileId
	try {
		const profile = await Profile.findById(profileId)
		const post = new Post({
			profile: profile,
			text: text,
		})
		profile.posts.push(post)
		await profile.save()
	} catch (err) {
		next(err)
	}
}
