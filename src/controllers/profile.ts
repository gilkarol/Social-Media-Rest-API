import { NextFunction, Response } from 'express'

import Profile from '../models/profile'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

import { isBlocked, hasBlocked } from '../util/functions'

export const getProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId!
	const loggedProfileId: string = req.profileId!

	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')
		const isFriend = loggedProfile.friends.indexOf(profileId) >= 0
		const isInvited = loggedProfile.invitedProfiles.indexOf(profileId) >= 0
		const hasInvited = profile.invitedProfiles.indexOf(loggedProfileId) >= 0

		res.status(200).json({
			message: 'Profile has been found!',
			profile: profile,
			isSameUser: profileId.toString() === loggedProfileId.toString(),
			isFriend: isFriend,
			isInvited: isInvited,
			hasInvited: hasInvited,
		})
	} catch (err) {
		next(err)
	}
}

export const postBlockProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId = req.params.profileId
	const loggedProfileId = req.profileId!
	try {
		const loggedProfile = await Profile.findById(loggedProfileId)
		const profile = await Profile.findById(profileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')
		if (loggedProfile.blockedProfiles.indexOf(profileId) >= 0)
			throw new Err(409, 'You already blocked this user!')

		loggedProfile.blockedProfiles.push(profile)
		await loggedProfile.save()

		res.status(200).json({ message: 'User has been blocked successfully!' })
	} catch (err) {
		next(err)
	}
}

export const postUnblockProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId = req.params.profileId
	const loggedProfileId = req.profileId!
	try {
		const loggedProfile = await Profile.findById(loggedProfileId)
		const profile = await Profile.findById(profileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')
		if (loggedProfile.blockedProfiles.indexOf(profileId) == -1)
			throw new Err(409, 'This profile is not blocked by you!')

		loggedProfile.blockedProfiles.pull(profile)
		await loggedProfile.save()

		res.status(200).json({ message: 'User has been unblocked successfully!' })
	} catch (err) {
		next(err)
	}
}
