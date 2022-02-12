import { Router } from 'express'
import isAuth from '../middleware/is-auth'

import {  postPost } from '../controllers/post'

const router = Router()

router.post('/', isAuth, postPost)

export default router
