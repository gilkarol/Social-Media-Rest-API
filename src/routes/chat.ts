import { Router } from 'express'

import { getChat } from '../controllers/message'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:userId', isAuth, getChat)

export default router