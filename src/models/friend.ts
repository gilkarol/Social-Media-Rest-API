import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	profile: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Profile',
        unique: true
	},
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    profilesWhoInvited: [
        {
            type: Schema.Types.ObjectId,
			ref: 'User',
        }
    ],
	invitedProfiles: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

export default mongoose.model('Friend', profileSchema)
