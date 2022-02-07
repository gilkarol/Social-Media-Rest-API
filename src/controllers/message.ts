import { NextFunction, Response } from "express";

import { Req } from "../util/interfaces";

export const getChat = async (req: Req, res: Response, next: NextFunction) => {
    const profileId: string = req.params.profileId
    const loggedProfileId: string = req.profileId!
    try {

    } catch (err) {
        next(err)
    }

    
}