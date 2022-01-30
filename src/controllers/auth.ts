import { NextFunction, Response } from 'express'

import { Req } from '../util/interfaces'

export const signup = (req: Req, res: Response, next: NextFunction) => {
    const email: string = req.body.email
    const nickname: string = req.body.nickname
    const password: string = req.body.password

    
}
