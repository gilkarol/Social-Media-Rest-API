import mongoose, { Schema } from 'mongoose'

const GroupMessageSchema = new Schema(
	{
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
		message: {
			type: String,
		},
		chat: {
			type: Schema.Types.ObjectId,
			ref: 'GroupChat'
		}
	},
	{ timestamps: true }
)

export default mongoose.model('GroupMessage', GroupMessageSchema)
