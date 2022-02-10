import { NextFunction, Response } from 'express'

import Group from '../models/group'
import Post from '../models/post'
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
		if (group.participants.indexOf(profileId) >= 0)
			throw new Err(409, 'You are already member of this group!')
		group.joinRequests.push(profile)
		profile.requestsToJoinGroups.push(group)
		await group.save()
		await profile.save()
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
		if (group.participants.indexOf(profile) == -1)
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

// --------------------------- ADMIN ---------------------------

const isAdmin = async (groupId: string, profileId: string) => {
	const group = await Group.findById(groupId)
	if (!group) throw new Err(404, 'This group does not exist!')
	if (group.admins.indexOf(profileId) === -1) return false
	return true
}

export const postCreateGroup = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const postGiveAdmin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const getRequestsToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const acceptRequestToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const declineRequestToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const deleteRemoveProfileFromGroup = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}

export const deletePostAsAdmin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {}
