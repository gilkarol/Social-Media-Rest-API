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
		if (group.members.indexOf(profileId) >= 0)
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

export const postCreateGroup = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.profileId!
	try {
		const profile = await Profile.findById(profileId)
		const group = new Group({
			members: profileId,
			groupCreator: profileId,
			admins: profileId,
		})
		profile.groups.push(group)
		await group.save()
		await profile.save()
		res.status(201).json({ message: 'Group has been created successfully!' })
	} catch (err) {
		next(err)
	}
}

export const postGiveAdmin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const groupId: string = req.params.groupId
	const loggedProfileId: string = req.profileId!
	const profileId: string = req.params.profileId
	try {
		const group = await Group.findById(groupId)
		const profile = await Profile.findById(profileId)

		if (!profile) throw new Err(409, 'This profile does not exist!')
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.groupCreator.toString() !== loggedProfileId.toString())
			throw new Err(409, 'You are not the creator of group!')
		if (group.members.indexOf(profileId) === -1)
			throw new Err(409, 'This profile is not the member of group!')

		group.admins.push(profile)
		await group.save()
	} catch (err) {
		next(err)
	}
}

export const getRequestsToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const groupId: string = req.params.groupId
	const profileId: string = req.profileId!
	try {
		const group = await Group.findById(groupId)
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.admins.indexOf(profileId) === -1)
			throw new Err(409, 'You need to be admin to see requests to join!')
		const requests = group.joinRequests

		res.status(200).json({
			message: 'Requests to join found successfully!',
			requests: requests,
		})
	} catch (err) {
		next(err)
	}
}

export const acceptRequestToJoin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const groupId: string = req.params.groupId
	const loggedProfileId: string = req.profileId!
	const profileId = req.params.profileId

	try {
		const group = await Group.findById(groupId)
		const profile = await Profile.findById(profileId)

		if (!profile) throw new Err(409, 'This profile does not exist!')
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.admins.indexOf(loggedProfileId) === -1)
			throw new Err(409, 'You are not admin!')

		group.joinRequest.pull(profileId)
		group.members.push(profileId)
		profile.requestsToJoinGroups.pull(group)

		await group.save()
		await profile.save()
		res
			.status(200)
			.json({ message: 'Profile has been successfully added to the group!' })
	} catch (err) {
		next(err)
	}
}

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
