import { Router } from 'express'
import isAuth from '../middleware/is-auth'

import {  postPost, getProfilePosts, patchPost, deletePost } from '../controllers/post'

const router = Router()

router.post('/', isAuth, postPost)

router.get('/:profileId', isAuth, getProfilePosts)

router.patch('/:profileId', isAuth, patchPost)

router.delete('/:profileId', isAuth, deletePost)

export default router
