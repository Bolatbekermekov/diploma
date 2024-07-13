import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { model, Schema } from 'mongoose'
import { UserDocument } from '../types'

const userSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			required: [true, 'Please Enter Email'],
			unique: true,
		},
		name: {
			type: String,
			required: [true, 'Please Enter Name'],
		},
		role: {
			type: String,
			enum: ['superadmin', 'admin', 'user'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Please Enter Password'],
			minLength: [6, 'Password must be at least 6 characters long'],
			select: false,
		},
	},
	{
		timestamps: true, // Automatically create createdAt timestamp
	}
)

userSchema.methods.comparePassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateToken = function () {
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '182d',
	})
}

/**
 * Runs before the model saves and hecks to see if password has been
 * modified and hashes the password before saving to database
 */
userSchema.pre('save', async function (this: UserDocument, next) {
	if (!this.isModified('password')) next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

export const User = model<UserDocument>('User', userSchema)
