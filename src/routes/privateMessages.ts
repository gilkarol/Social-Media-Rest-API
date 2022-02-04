import { Router } from 'express'

import { getMessages } from '../controllers/privateMessages'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:userId', isAuth, getMessages)

export default router