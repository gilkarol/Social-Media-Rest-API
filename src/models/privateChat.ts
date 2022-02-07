import mongoose, { Schema } from 'mongoose'

const privateChatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }] 
})

export default mongoose.model('PrivateChat', privateChatSchema)
