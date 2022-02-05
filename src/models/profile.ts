import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
		unique: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	imageUrl: String,
	blockedUsers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	friends: [{
		type: Schema.Types.ObjectId,
		ref: 'Profile'
	}],
    profilesWhoInvited: [
        {
            type: Schema.Types.ObjectId,
			ref: 'Profile',
        }
    ],
	invitedProfiles: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Profile',
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
