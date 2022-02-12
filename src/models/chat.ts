import mongoose, { Schema } from 'mongoose'

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }] ,
    groupChat: {
        type: Boolean,
        required: true
    }
})

export default mongoose.model('PrivateChat', chatSchema)
