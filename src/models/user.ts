import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { model, Schema, Document } from 'mongoose'

export interface UserID {
	_id: string
	name: string
	email: string
	password: string
	role?: string
	generateToken: () => string
	comparePassword: (password: string) => Promise<Boolean>
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: UserID
	}
}

export interface UserDocument extends Omit<UserID, '_id'>, Document {}

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
		timestamps: true, // Automatically create createdAt and updatedAt timestamps
	}
)

userSchema.methods.comparePassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateToken = function () {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined')
	}

	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '182d',
	})
}

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

export const User = model<UserDocument>('User', userSchema)
