import { Router } from 'express'

import isAuth from '../middleware/is-auth'
import { getFriends, postInviteToFriends, postAcceptInviteToFriends, deleteRemoveInviteToFriends, deleteDeclineInviteToFriends, getInvitedFriends, deleteRemoveFromFriends, getInvitationsToFriends } from '../controllers/friend'

const router = Router()

router.get('/invitedFriends', isAuth, getInvitedFriends)

router.get('/invitations', isAuth, getInvitationsToFriends)

router.get('/:profileId', isAuth, getFriends)

router.post('/invite/:profileId', isAuth, postInviteToFriends)

router.post('/accept/:profileId', isAuth, postAcceptInviteToFriends)

router.delete('/remove/:profileId', isAuth, deleteRemoveFromFriends)

router.delete('/declineInvite/:profileId', isAuth, deleteDeclineInviteToFriends)

router.delete('/removeInvite/:profileId', isAuth, deleteRemoveInviteToFriends)

export default router