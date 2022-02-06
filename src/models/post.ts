import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
	{
		profile: {
			type: Schema.Types.ObjectId,
			ref: 'Profile',
		},
        text: {
            type: String,
            required: true
        }
	},
	{ timestamps: true }
)
export default mongoose.model('Post', postSchema)
