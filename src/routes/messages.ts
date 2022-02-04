import { Router } from 'express'

import { getMessages, postMessages, patchMessage, deleteMessage, getMessage, getUserMessages } from '../controllers/messages'
import isAuth from '../middleware/is-auth'

const router = Router()

// CHAT FOR EVERYONE

router.get('/', isAuth, getMessages)

router.get('/userMessages/:nickname', isAuth, getUserMessages)

router.get('/:messageId', isAuth, getMessage)

router.post('/', isAuth, postMessages)

router.patch('/:messageId', isAuth, patchMessage)

router.delete('/:messageId', isAuth, deleteMessage)

export default router
