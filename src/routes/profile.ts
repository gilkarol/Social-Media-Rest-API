import { Router } from 'express'

import { getProfile } from '../controllers/profile'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getProfile)

export default router