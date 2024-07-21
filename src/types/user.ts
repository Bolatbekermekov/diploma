// import { Document, Model } from 'mongoose'

// /**
//  * Represents a user
//  */
// export interface UserID {
// 	_id: string
// 	name: string
// 	email: string
// 	password: string
// 	role?: string
// 	generateToken: () => string
// }

// declare module 'express-serve-static-core' {
// 	interface Request {
// 		user?: UserID
// 	}
// }

// export interface UserDocument extends UserID, Document {
// 	comparePassword: (password: string) => Promise<Boolean>
// }

