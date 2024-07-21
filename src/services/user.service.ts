import { User, UserDocument } from '../models/user'
import ErrorHandler from '../errors/errorHandler'

class UsersService {
	async getById(id: string): Promise<UserDocument> {
		const user = await User.findById(id).select('+password')

		if (!user) {
			throw new ErrorHandler('User not found', 404)
		}

		return user
	}
}

export const usersService = new UsersService()
