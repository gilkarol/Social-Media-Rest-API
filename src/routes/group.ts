import { Router } from 'express'
import { getGroupChat, getGroupPosts, postPost, postRequestToJoin } from '../controllers/group'

import isAuth from '../middleware/is-auth'

const router = Router()

// ------------------------- MEMBERS --------------------------------

router.get('/posts/:groupId', isAuth, getGroupPosts)

router.post('/posts/:groupId', isAuth, postPost)

router.get('/chat/:groupId', isAuth, getGroupChat)

router.post('/requestToJoin/:groupId', isAuth, postRequestToJoin)

// ------------------------- ADMIN --------------------------------

export default router
