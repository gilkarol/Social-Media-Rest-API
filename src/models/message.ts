import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
	{
		message: {
			type: String,
			required: true,
		},
		creatorId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		creatorNickname: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

export default mongoose.model('Message', messageSchema)
