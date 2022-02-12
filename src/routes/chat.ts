import { Router } from 'express'

import { getChat, postMessage, patchMessage, deleteMessage } from '../controllers/privateChat'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/:profileId', isAuth, getChat)

router.post('/:profileId', isAuth, postMessage)

router.patch('/:messageId', isAuth, patchMessage)

router.delete('/:messageId', isAuth, deleteMessage)

export default router