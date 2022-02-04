import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	imageUrl: String,
	messages: [
		{
			type: Schema.Types.ObjectId,
            ref: 'Message'
		},
	],
	privateMessages: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
})

export default mongoose.model('User', userSchema)
