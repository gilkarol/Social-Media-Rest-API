import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema(
	{
		members: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
		title: { type: String, required: true },
		description: String,
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		groupCreator: { type: Schema.Types.ObjectId, ref: 'Profile' },
		admins: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
		chat: { type: Schema.Types.ObjectId, ref: 'GroupChat' },
		joinRequests: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
	},
	{ timestamps: true }
)

export default mongoose.model('Group', groupSchema)
