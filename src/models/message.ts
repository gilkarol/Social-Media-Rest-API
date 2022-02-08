import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
	{
		profileCreator: {
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
		message: {
			type: String,
		},
		messageToProfile: {
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
		messageToGroup: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Message', messageSchema)
