import { NextFunction, Response } from 'express'

import Post from '../models/post'
import Profile from '../models/profile'
import { Req } from '../util/interfaces'

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
		await post.save()
		await profile.save()
		res.status(200).json({ message: 'Post created successfully!' })
	} catch (err) {
		next(err)
	}
}

