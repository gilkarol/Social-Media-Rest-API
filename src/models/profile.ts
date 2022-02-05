import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
		unique: true,
	},
	nickname: {
		type: String,
		required: true,
	},
	imageUrl: String,
	blockedUsers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	Messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
})

export default mongoose.model('Profile', profileSchema)
