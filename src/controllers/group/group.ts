import { NextFunction, Response } from 'express'

import GroupChat from '../../models/groupChat'
import Group from '../../models/group'
import Post from '../../models/post'
import Profile from '../../models/profile'
import { Err } from '../../util/classes'
import { Req } from '../../util/interfaces'


export const getGroupInfo = async (
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
		const isMember = group.members.indexOf(profile) >= 0
		const requestedToJoin = group.joinRequests.indexOf(profile) >= 0
		res.status(200).json({
			message: 'Group info found successfully!',
			title: group.title,
			description: group.description,
			isMember: isMember,
			requestedToJoin: requestedToJoin,
		})
	} catch (err) {
		next(err)
	}
}

// POSTS

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
		if (group.members.indexOf(profileId) == -1)
			throw new Err(409, 'You are not member of the group!')
		const posts = group.posts

		res
			.status(200)
			.json({ message: 'Posts has been found successfully!', posts: posts })
	} catch (err) {
		next(err)
	}
}

export const postPost = async (req: Req, res: Response, next: NextFunction) => {
	const groupId: string = req.params.groupId
	const profileId: string = req.profileId!
	const text: string = req.body.text

	try {
		const group = await Group.findById(groupId)
		const profile = await Profile.findById(profileId)
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.members.indexOf(profile) == -1)
			throw new Err(409, 'You are not the member of group!')
		const post = new Post({
			profile: profile,
			text: text,
		})
		group.posts.push(post)
		await post.save()
		await group.save()
	} catch (err) {
		next(err)
	}
}

export const patchPost = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const postId: string = req.params.postId
	const groupId: string = req.params.groupId
	const profileId: string = req.profileId!
	const text: string = req.body.text

	try {
		const post = await Post.findById(postId)
		if (!post) throw new Err(404, 'This post does not exist!')
		const group = await Group.findById(groupId)
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.posts.indexOf(postId) === -1)
			throw new Err(409, 'This post does not exist in this group!')
		if (post.profile.toString() !== profileId.toString())
			throw new Err(409, 'This profile is not creator of post!')
		post.text = text

		await post.save()
		res.status(200).json({ message: 'Post updated successfully!' })
	} catch (err) {
		next(err)
	}
}

export const deletePost = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const postId: string = req.params.postId
	const groupId: string = req.params.groupId
	const profileId: string = req.profileId!

	try {
		const post = await Post.findById(postId)
		const group = await Group.findById(groupId)
		if (!group) throw new Err(404, 'This group does not exist!')
		if (post.profile.toString() !== profileId.toString())
			throw new Err(409, 'You are not the creator of post!')

		group.posts.pull(post)

		await post.remove()
		await group.save()

		res.status(200).json({ message: 'Post has been deleted successfully!' })
	} catch (err) {
		next(err)
	}
}

// REQUESTS TO JOIN

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
		if (group.members.indexOf(profileId) >= 0)
			throw new Err(409, 'You are already member of this group!')
		if (group.joinRequests.indexOf(profile) >= 0)
			throw new Err(409, 'You already send request to join!')
		group.joinRequests.push(profile)
		profile.requestsToJoinGroups.push(group)
		await group.save()
		await profile.save()
	} catch (err) {
		next(err)
	}
}

export const deleteRequestToJoin = async (
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
		if (group.members.indexOf(profileId) >= 0)
			throw new Err(409, 'You are already member of this group!')
		if (group.joinRequests.indexOf(profile) === -1)
			throw new Err(409, 'Request does not exist!!')
		group.joinRequests.pull(profile)
		profile.requestsToJoinGroups.pull(group)
		await group.save()
		await profile.save()
	} catch (err) {
		next(err)
	}
}

// GROUP CHAT

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
		if (group.members.indexOf(profileId) == -1)
			throw new Err(409, 'You are not member of the group!')
		const chat = group.chat.populate('chat')
		res
			.status(200)
			.json({ message: 'Chat has been found successfully!', chat: chat })
	} catch (err) {
		next(err)
	}
}

export const postGroupMessage = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}