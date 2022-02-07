import { Router } from 'express'
import isAuth from '../middleware/is-auth'

import { getFriendsPosts, postPost } from '../controllers/post'

const router = Router()

router.get('/', isAuth, getFriendsPosts)

router.post('/', isAuth, postPost)

export default router
