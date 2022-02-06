import { NextFunction, Response } from 'express'
import { Schema } from 'mongoose'

import Profile from '../models/profile'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

const hasBlocked = async (profileWhoBlockedId: string, isBlockedId: string) => {
	const profileWhoBlocked = await Profile.findById(profileWhoBlockedId).select(
		'blockedProfiles'
	)
	if (profileWhoBlocked.blockedProfiles.indexOf(isBlockedId) >= 0) {
		return true
	}
	return false
}

const isBlocked = async (profileWhoMightBlockId: string, isBlockedId: string) => {
	const profileWhoMightBlock = await Profile.findById(profileWhoMightBlockId).select(
		'blockedProfiles'
	)
	if (profileWhoMightBlock.blockedProfiles.indexOf(isBlockedId) >= 0) {
		return true
	}
	return false

}

export const getProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId!
	const loggedProfileId: string = req.profileId!

	
	try {
		if (await hasBlocked(profileId, loggedProfileId)) throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId)) throw new Err(409, 'You blocked this user!')
		
		const profile = await Profile.findById(profileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')

		res.status(200).json({
			message: 'Profile has been found!',
			profile: profile,
			isSameUser: profileId.toString() === loggedProfileId.toString(),
		})
	} catch (err) {
		next(err)
	}
}

export const getFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!

	try {
		if (await hasBlocked(profileId, loggedProfileId)) throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId)) throw new Err(409, 'You blocked this user!')

		const profile = await Profile.findById(profileId)
			.select('friends')
			.populate('friends', 'nickname')
		if (!profile) throw new Err(404, 'This profile does not exist!')
		res.status(200).json({
			message: 'Friends found successfully!',
			friends: profile.friends,
		})
	} catch (err) {
		next(err)
	}
}

export const inviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId)) throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId)) throw new Err(409, 'You blocked this user!')
		
		if (profileId.toString() === loggedProfileId.toString())
			throw new Err(409, 'You can not add yourself to friends!')
		const profile = Profile.findById(profileId)
		const loggedProfile = Profile.findById(loggedProfileId)
	} catch (err) {
		next
	}
}
