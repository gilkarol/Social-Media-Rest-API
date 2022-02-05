import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	profile: {
		type: Schema.Types.ObjectId,
		unique: true
	}
})

export default mongoose.model('User', userSchema)
