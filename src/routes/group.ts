import { Router } from 'express'
import { deleteDeclineRequestToJoin, deletePost, deletePostAsAdmin, deleteRemoveProfileFromGroup, getGroupChat, getGroupPosts, getRequestsToJoin, postAcceptRequestToJoin, postCreateGroup, postGiveAdmin, postPost, postRequestToJoin } from '../controllers/group'

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

router.get('/:groupId/joinRequests', isAuth, getRequestsToJoin)

router.post('/:groupId/accept/:profileId', isAuth, postAcceptRequestToJoin)

router.delete('/:groupId/decline/:profileId', isAuth, deleteDeclineRequestToJoin)

router.delete('/:groupId/remove/:profileId', isAuth, deleteRemoveProfileFromGroup)

router.delete('/:groupId/delete/:postId', isAuth, deletePostAsAdmin)

export default router
