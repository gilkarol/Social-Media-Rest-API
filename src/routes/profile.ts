import { Router } from 'express'

import { getProfile, postInviteToFriends } from '../controllers/profile'

const router = Router()

router.get('/:profileUserId', getProfile)

router.post('/inviteToFriends/:profileUserId', postInviteToFriends)

export default router