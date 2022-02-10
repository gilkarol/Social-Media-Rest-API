import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema(
	{
		members: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		groupCreator: {type: Schema.Types.ObjectId, ref: 'Profile'},
		admins: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
		chat: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
		joinRequests: [{type: Schema.Types.ObjectId, ref: 'Profile'}]
	},
	{ timestamps: true }
)

export default mongoose.model('Group', groupSchema)
