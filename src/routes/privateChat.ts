import { Router } from 'express'

import { getChat, postMessage, patchMessage } from '../controllers/privateChat'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getChat)

router.post('/:profileId', isAuth, postMessage)

router.patch('/:messageId', isAuth, patchMessage)

export default router