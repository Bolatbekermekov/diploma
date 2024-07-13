import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import LocalizedError from '../errors/localized-error'
import { localizedErrorMessages } from '../errors/localized-messages'
import { User } from '../models/user'
import { sendToken } from '../utils/feature'

export const authUser = asyncHandler(
	async (req: Request, res: Response, next: any) => {
		const { email, password } = req.body as { email: string; password: string }

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			return next(
				new LocalizedError(localizedErrorMessages['404_USER_NOT_FOUND'], 404)
			)
		}

		if (!password) {
			return next(
				new LocalizedError(localizedErrorMessages['400_MISSING_PASSWORD'], 400)
			)
		}

		const isMatched = await user.comparePassword(password)

		if (!isMatched) {
			return next(
				new LocalizedError(
					localizedErrorMessages['400_INCORRECT_PHONE_OR_PASSWORD'],
					400
				)
			)
		}

		return sendToken(user, res, `Welcome Back, ${user.name}`, 200)
	}
)

/**
 * Register a new user
 * @route POST /api/users
 * @access Public
 */
export const registerUser = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, email, password } = req.body as {
			name: string
			email: string
			password: string
		}

		const userExists = await User.findOne({ email })

		if (userExists) {
			res.status(400)
			throw new Error('User already exists')
		}

		const user = await User.create({
			name,
			email,
			password,
		})

		return sendToken(user, res, 'Registered Successfully', 201)
	}
)

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
// const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
// 	const user = await User.findById(req.user?._id)

// 	if (user) {
// 		res.json({
// 			user: user,
// 		})
// 	} else {
// 		res.status(404)
// 		throw new Error('User not found')
// 	}
// })
