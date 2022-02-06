import { NextFunction, Response } from 'express'

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

const isBlocked = async (
	profileWhoMightBlockId: string,
	isBlockedId: string
) => {
	const profileWhoMightBlock = await Profile.findById(
		profileWhoMightBlockId
	).select('blockedProfiles')
	if (profileWhoMightBlock.blockedProfiles.indexOf(isBlockedId) >= 0) {
		return true
	}
	return false
}

// ------------------------------------- PROFILES -------------------------------------

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

// ------------------------------------- FRIENDS -------------------------------------

export const getFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!

	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

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

export const getInvitedFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const loggedProfileId: string = req.profileId!
	try {
		const profile = await Profile.findById(loggedProfileId)
		const invitedFriends = profile.invitedFriends
		res
			.status(200)
			.json({
				message: 'Invited users found successfully!',
				invitedFriends: invitedFriends,
			})
	} catch (err) {
		next(err)
	}
}

export const postInviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

		if (profileId.toString() === loggedProfileId.toString())
			throw new Err(409, 'You can not add yourself to friends!')

		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)
		if (loggedProfile.invitedProfiles.indexOf(profileId) >= 0)
			throw new Err(409, 'You already invited this profile to friends!')
		if (loggedProfile.friends.indexOf(profileId) >= 0)
			throw new Err(409, 'This profile is already your friend!')

		if (profile.invitedProfiles.indexOf(loggedProfileId) >= 0) {
			loggedProfile.profilesWhoInvited.pull(profile)
			loggedProfile.friends.push(profile)
			
			profile.invitedProfiles.pull(loggedProfile)
			profile.friends.push(loggedProfile)

			await loggedProfile.save()
			await profile.save()

			return res.status(200).json({
				message: 'This profile invited you earlier so now is your friend!',
			})
		}

		profile.profilesWhoInvited.push(loggedProfile)
		loggedProfile.invitedProfiles.push(profile)

		await profile.save()
		await loggedProfile.save()

		res
			.status(200)
			.json({ message: 'User has been succesffully invited to your friends!' })
	} catch (err) {
		next(err)
	}
}

export const postAcceptInviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)
		if (profile.invitedFriends.indexOf(loggedProfileId) == -1)
			throw new Err(409, 'This user did not invite you to friends!')

		profile.invitedFriends.pull(loggedProfile)
		profile.friends.push(loggedProfile)

		loggedProfile.profilesWhoInvited.pull(loggedProfile)
		loggedProfile.friends.push(profile)

		await profile.save()
		await loggedProfile.save()

		res
			.status(200)
			.json({ message: 'Successfully accepted invite to friends!' })
	} catch (err) {
		next(err)
	}
}

export const deleteDeclineInviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)

		profile.invitedProfiles.pull(loggedProfile)
		loggedProfile.profilesWhoInvited.pull(profile)

		profile.save()
		loggedProfile.save()

		res.status(200).json({message: 'Invite has been successfully declined!'})
	} catch (err) {
		next(err)
	}
}

export const deleteRemoveInviteToFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')


		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)

		loggedProfile.invitedFriends.pull(profile)
		profile.profilesWhoInvited.pull(loggedProfile)

		await loggedProfile.save()
		await profile.save()

		res.status(200).json({message: 'Invite has been removed successfully!'})
	} catch (err) {
		next(err)
	}
}

export const deleteRemoveFromFriends = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId
	const loggedProfileId: string = req.profileId!
	try {
		if (await hasBlocked(profileId, loggedProfileId))
			throw new Err(409, 'User has blocked you!')
		if (await isBlocked(loggedProfileId, profileId))
			throw new Err(409, 'You blocked this user!')

		const profile = await Profile.findById(profileId)
		const loggedProfile = await Profile.findById(loggedProfileId)
		if (loggedProfile.friends.indexOf(profileId) == -1)
			throw new Err(409, 'This profile is not your friend!')

		profile.friends.pull(loggedProfile)
		loggedProfile.friends.pull(profile)
		await profile.save()
		await loggedProfile.save()

		res.status(200).json({
			message: 'Profile has been successfully removed from your friends!',
		})

	} catch (err) {
		next(err)
	}
}

