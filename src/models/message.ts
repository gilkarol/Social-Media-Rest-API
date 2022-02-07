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
	},
	{ timestamps: true }
)

export default mongoose.model('Message', messageSchema)
