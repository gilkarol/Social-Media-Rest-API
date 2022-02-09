import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema(
	{
		participants: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		chat: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
		joinRequests: [{type: Schema.Types.ObjectId, ref: 'Profile'}]
	},
	{ timestamps: true }
)

export default mongoose.model('Group', groupSchema)
