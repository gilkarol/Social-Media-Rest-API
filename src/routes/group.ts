import { Router } from 'express'
import { deletePost, getGroupChat, getGroupPosts, postCreateGroup, postGiveAdmin, postPost, postRequestToJoin } from '../controllers/group'

import isAuth from '../middleware/is-auth'

const router = Router()

// ------------------------- MEMBERS --------------------------------

router.get('/posts/:groupId', isAuth, getGroupPosts)

router.post('/posts/:groupId', isAuth, postPost)

router.delete('/post/:groupId/:postId', isAuth, deletePost)

router.get('/chat/:groupId', isAuth, getGroupChat)

router.post('/requestToJoin/:groupId', isAuth, postRequestToJoin)

// ------------------------- ADMIN --------------------------------

router.post('/create', isAuth, postCreateGroup)

router.post('/:groupId/giveAdmin/:profileId', isAuth, postGiveAdmin)

export default router
