import { Router } from 'express'
import isAuth from '../middleware/is-auth'

import {  postPost, getProfilePosts } from '../controllers/post'

const router = Router()

router.post('/', isAuth, postPost)

router.get('/:profileId', isAuth, getProfilePosts)

export default router
