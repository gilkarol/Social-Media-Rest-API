import { Router } from 'express'

import { getProfile, getFriends, postInviteToFriends, postAcceptInviteToFriends, deleteRemoveInviteToFriends, deleteDeclineInviteToFriends, getInvitedFriends, deleteRemoveFromFriends, getInvitationsToFriends } from '../controllers/profile'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getProfile)

router.get('/friends/invitedFriends', isAuth, getInvitedFriends)

router.get('/friends/invitations', isAuth, getInvitationsToFriends)

router.get('/friends/:profileId', isAuth, getFriends)

router.post('/friends/invite/:profileId', isAuth, postInviteToFriends)

router.post('/friends/accept/:profileId', isAuth, postAcceptInviteToFriends)

router.delete('/friends/remove/:profileId', isAuth, deleteRemoveFromFriends)

router.delete('/friends/declineInvite/:profileId', isAuth, deleteDeclineInviteToFriends)

router.delete('/friends/removeInvite/:profileId', isAuth, deleteRemoveInviteToFriends)


export default router