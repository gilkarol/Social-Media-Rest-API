import mongoose, { Schema } from 'mongoose'

const privateMessageSchema = new Schema(
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
			ref: 'PrivateChat'
		}
	},
	{ timestamps: true }
)

export default mongoose.model('PrivateMessage', privateMessageSchema)
