import mongoose from 'mongoose'

export const connectDB = async () => {
	const mongo_url = process.env.MONG_URL || ''
	try {
		const { connection } = await mongoose.connect(mongo_url, {
			dbName: process.env.MONGO_DATABASE,
		})

		console.log(`Server connected to database ${connection.host}`)
	} catch (error) {
		console.log('Some Error Occurred', error)
		process.exit(1)
	}
}
