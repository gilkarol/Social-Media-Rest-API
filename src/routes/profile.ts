import { Router } from 'express'

import { getProfile, getFriends, postInviteToFriends, postAcceptInviteToFriends, getInvitedFriends, deleteRemoveFromFriends } from '../controllers/profile'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getProfile)

router.get('/friends/:profileId', isAuth, getFriends)

router.get('/friends/invitedFriends', isAuth, getInvitedFriends)

router.post('/friends/add/:profileId', isAuth, postInviteToFriends)

router.post('/friends/accept/:profileId', isAuth, postAcceptInviteToFriends)

router.delete('/friends/remove/:profileId', isAuth, deleteRemoveFromFriends)

router.delete('/friends/remove/:profileId', isAuth, deleteRemoveFromFriends)

export default router