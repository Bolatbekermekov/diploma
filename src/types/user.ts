import { Document, Model } from 'mongoose'

/**
 * Represents a user
 */
export interface User {
	name: string
	email: string
	password: string
	role?: string
}

export interface UserDocument extends User, Document {
	comparePassword: (password: string) => Promise<Boolean>
}

export interface UserModel extends Model<UserDocument> {}
