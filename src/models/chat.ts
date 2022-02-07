import mongoose, { Schema } from 'mongoose'

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }] 
})

export default mongoose.model('Chat', chatSchema)
