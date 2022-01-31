import { Router } from 'express'

import { getMessages, postMessages, patchMessage } from '../controllers/messages'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/', isAuth, getMessages)

router.post('/', isAuth, postMessages)

router.patch('/:messageId', isAuth, patchMessage)

export default router
