import { NextFunction, Response } from 'express'

import GroupChat from '../../models/groupChat'
import Group from '../../models/group'
import Post from '../../models/post'
import Profile from '../../models/profile'
import { Err } from '../../util/classes'
import { Req } from '../../util/interfaces'

export const postCreateGroup = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.profileId!
	try {
		const profile = await Profile.findById(profileId)
		const chat = new GroupChat({
			members: profile
		})
		const group = new Group({
			members: profileId,
			groupCreator: profileId,
			admins: profileId,
			chat: chat
		})
		profile.groups.push(group)
		await chat.save()
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

export const postAcceptRequestToJoin = async (
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
        const chat = await GroupChat.findOne({group: groupId})

		if (!profile) throw new Err(409, 'This profile does not exist!')
		if (!group) throw new Err(404, 'This group does not exist!')
		if (!chat) throw new Err(404, 'This chat does not exist!')
		if (group.admins.indexOf(loggedProfileId) === -1)
			throw new Err(409, 'You are not admin!')

		group.joinRequest.pull(profileId)
		group.members.push(profileId)
        chat.participants.push(profileId)
		profile.requestsToJoinGroups.pull(group)

		await group.save()
        await chat.save()
		await profile.save()
		res
			.status(200)
			.json({ message: 'Profile has been successfully added to the group!' })
	} catch (err) {
		next(err)
	}
}

export const deleteDeclineRequestToJoin = async (
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
		profile.requestsToJoinGroups.pull(group)

		await group.save()
		await profile.save()
		res.status(200).json({
			message: 'Request to join group has been successfully declined!',
		})
	} catch (err) {
		next(err)
	}
}

export const deleteRemoveProfileFromGroup = async (
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
        const chat = await GroupChat.findOne({group: groupId})

		if (!profile) throw new Err(409, 'This profile does not exist!')
		if (!group) throw new Err(404, 'This group does not exist!')
		if (!chat) throw new Err(404, 'This chat does not exist!')
		if (group.admins.indexOf(loggedProfileId) === -1)
			throw new Err(409, 'You are not admin!')
		if (group.admins.indexOf(profileId) >= 0) {
			if (group.groupCreator != loggedProfileId)
				throw new Err(
					409,
					'You need to be group creator to remove admin from group!'
				)
			group.admins.pull(profile)
			group.members.pull(profile)
            chat.participants.pull(profile)
			profile.groups.pull(group)
			await group.save()
            await chat.save()
			return res.status(200).json({
				message: 'Profile has been successfully removed from the group!',
			})
		}
		profile.groups.pull(group)
		group.members.pull(profileId)
		await group.save()
		await profile.save()
		res.status(200).json({
			message: 'Profile has been successfully removed from the group!',
		})
	} catch (err) {
		next(err)
	}
}

export const deletePostAsAdmin = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const postId: string = req.params.postId
	const groupId: string = req.params.groupId
	const profileId: string = req.profileId!

	try {
		const group = await Group.findById(groupId)
		const post = await Post.findById(postId)
		if (!post) throw new Err(404, 'This post does not exist!')
		if (!group) throw new Err(404, 'This group does not exist!')
		if (group.admins.indexOf(profileId) === -1)
			throw new Err(409, 'You are not admin of the group!')
		if (group.posts.indexOf(profileId) === -1)
			throw new Err(409, 'This post does not exist in this group!')

		group.posts.pull(post)
		await post.remove()
		await group.save()

		res
			.status(200)
			.json({ message: 'Post has been succesffully removed from the group!' })
	} catch (err) {
		next(err)
	}
}