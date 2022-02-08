import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
	{
		profile: {
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
		message: {
			type: String,
		},
		messageTo: {
			type: Schema.Types.ObjectId,
			ref: 'Profile'
		}
	},
	{ timestamps: true }
)

export default mongoose.model('Message', messageSchema)
