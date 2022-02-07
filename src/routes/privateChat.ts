import { Router } from 'express'

import { getChat, postMessage } from '../controllers/privateChat'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:userId', isAuth, getChat)

router.post('/:userId', isAuth, postMessage)

export default router