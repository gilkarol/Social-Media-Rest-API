import { Router } from 'express'

import { getProfile, getFriends, postInviteToFriends, getInvitedFriends, deleteRemoveFromFriends } from '../controllers/profile'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getProfile)

router.get('/friends/:profileId', isAuth, getFriends)

router.get('/friends/invitedFriends', isAuth, getInvitedFriends)

router.post('/friends/:profileId', isAuth, postInviteToFriends)

router.delete('/friends/:profileId', isAuth, deleteRemoveFromFriends)

export default router