export const TOKEN_EXPIRATION = 6 * 30 * 24 * 60 * 60 * 1000

export const sendToken = (user, res, message, statusCode) => {
	const token = user.generateToken()

	return res
		.status(statusCode)
		.cookie('token', token, {
			...cookieOptions(),
			expires: new Date(Date.now() + TOKEN_EXPIRATION),
		})
		.json({
			success: true,
			message: message,
			token: token,
		})
}

export const cookieOptions = () => ({
	httpOnly: true,
	sameSite: 'none',
})
