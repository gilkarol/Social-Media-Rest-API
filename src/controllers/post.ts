import { NextFunction, Response } from 'express'

import Post from '../models/post'
import Profile from '../models/profile'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

export const getProfilePosts = async (req: Req, res: Response, next: NextFunction) => {
	const profileId = req.params.profileId
	const loggedProfileId = req.profileId
	try {
		const profile = await Profile.findById(profileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')
		if (profile.friends.indexOf(profileId) === -1) throw new Err(409, 'This profile is not your friend!')
		const posts = profile.posts
		res.status(200).json({ message: 'Profile posts found successfully!', posts: posts })
	} catch (err) {
		next(err)
	}
}

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
		res.status(201).json({ message: 'Post created successfully!' })
	} catch (err) {
		next(err)
	}
}

export const patchPost = async (req: Req, res: Response, next: NextFunction) => {
	const text: string = req.body.text
	const postId: string = req.params.postId
	const profileId: string = req.profileId!
	try {
		const profile = await Profile.findById(profileId)
		const post = await Post.findById(postId)
		if (!post) throw new Err(404, 'This post does not exist!')
		if (profile.posts.indexOf(post) === -1) throw new Err(409, 'You are not creator of the post!')
		post.text = text
		await post.save()
		await profile.save()
		res.status(200).json({ message: 'Post updated successfully!' })
	} catch (err) {
		next(err)
	}
}

export const deletePost = async (req: Req, res: Response, next: NextFunction) => {
	const postId: string = req.params.postId
	const profileId: string = req.profileId!
	try {
		const profile = await Profile.findById(profileId)
		const post = await Post.findById(postId)
		if (!post) throw new Err(404, 'This post does not exist!')
		if (profile.posts.indexOf(post) === -1) throw new Err(409, 'You are not creator of the post!')
		profile.posts.pull(post)
		await post.remove()
		await profile.save()
		res.status(200).json({ message: 'Post deleted successfully!' })
	} catch (err) {
		next(err)
	}
}

