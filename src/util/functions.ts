import Profile from '../models/profile'

export const hasBlocked = async (profileWhoBlockedId: string, isBlockedId: string) => {
	const profileWhoBlocked = await Profile.findById(profileWhoBlockedId).select(
		'blockedProfiles'
	)
	if (profileWhoBlocked.blockedProfiles.indexOf(isBlockedId) >= 0) {
		return true
	}
	return false
}

export const isBlocked = async (
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