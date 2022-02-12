import mongoose, { Schema } from 'mongoose'

const groupChatSchema = new Schema({
	group: { type: Schema.Types.ObjectId, ref: 'Group' },
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
})

export default mongoose.model('GroupChat', groupChatSchema)
