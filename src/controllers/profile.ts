import { NextFunction, Response } from 'express'

import User from '../models/user'
import Profile from '../models/profile'
import { Err } from '../util/classes'
import { Req } from '../util/interfaces'

export const getProfile = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const profileId: string = req.params.profileId!
	const loggedProfileId: string = req.profileId!

	try {
		const profile = await Profile.findById(profileId)
		if (!profile) throw new Err(404, 'This profile does not exist!')

		res
			.status(200)
			.json({
				message: 'Profile has been found!',
				profile: profile,
				isSameUser: profileId.toString() === loggedProfileId.toString(),
			})
	} catch (err) {
		next(err)
	}
}

export const getFriends = async (req: Req, res: Response, next: NextFunction) => {
    const profileId: string = req.params.profileId

    try {
        const profile = await Profile.findById(profileId).select('friends').populate('friends', 'nickname')
        if (!profile) throw new Err(404, 'This profile does not exist!')
        res.status(200).json({message: 'Friends found successfully!', friends: profile.friends})
    } catch (err) {
        next(err)
    }
}

export const inviteToFriends = async (req: Req, res: Response, next: NextFunction) => {
    const profileId: string = req.params.profileId
    const loggedProfileId: string = req.profileId!
    try {
        if (profileId.toString() === loggedProfileId.toString()) throw new Err(409, 'You can not add yourself to friends!')
        const profile = Profile.findById(profileId)
        const loggedProfile = Profile.findById(loggedProfileId)


        
    } catch (err) {
        next
    }
}