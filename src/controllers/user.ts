import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import LocalizedError from '../errors/localized-error'
import { localizedErrorMessages } from '../errors/localized-messages'
import { User, UserID } from '../models/user'
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
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email, password } = req.body as {
			name: string
			email: string
			password: string
		}

		const userExists = await User.findOne({ email })

		if (userExists) {
			return next(
				new LocalizedError(
					localizedErrorMessages['400_USER_ALREADY_EXISTS'],
					400
				)
			)
		}

		const user = await User.create({
			name,
			email,
			password,
		})

		sendToken(user, res, 'Registered Successfully', 201)
	}
)

export const getUserProfile = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return next(new Error('User not found'))
		}
		const user = req.user as UserID

		res.json({
			success: true,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
			},
		})
	}
)
