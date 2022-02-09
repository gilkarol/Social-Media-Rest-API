import { Router } from 'express'
import { getGroupChat, getGroupPosts, postRequestToJoin } from '../controllers/group'

import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/posts/:groupId', isAuth, getGroupPosts)

router.get('/chat/:groupId', isAuth, getGroupChat)

router.post('/requestToJoin/:groupId', isAuth, postRequestToJoin)

export default router
