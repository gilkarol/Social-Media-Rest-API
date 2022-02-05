import { Router } from 'express'

import { getProfile, getFriends } from '../controllers/profile'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getProfile)

router.get('/friends/:profileId', isAuth, getFriends)

export default router