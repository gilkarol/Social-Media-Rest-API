import { Router } from 'express'

import { getProfile, postInviteToFriends } from '../controllers/profile'

const router = Router()

router.get('/:userId', getProfile)

router.post('/inviteToFriends/:userId', postInviteToFriends)

export default router