import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import ErrorHandler from '../errors/errorHandler'
import { UserID } from '../models/user'
import { usersService } from './../services/user.service'

interface DecodedToken {
	_id: string
	iat: number
	exp: number
}

export const isAuthenticated = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token =
				req.cookies.token || req.headers.authorization?.split(' ')[1]

			if (!token) {
				return next(new ErrorHandler('Token not found', 401))
			}

			const decodedData = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as DecodedToken

			if (!decodedData || !decodedData._id) {
				return next(new ErrorHandler('Invalid Token', 401))
			}

			const user = (await usersService.getById(decodedData._id)) as UserID

			if (!user) {
				return next(new ErrorHandler('User not found', 404))
			}

			req.user = user
			next()
		} catch (error) {
			next(new ErrorHandler((error as Error).message, 401))
		}
	}
)
