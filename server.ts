import { app } from './app'
import { connectDB } from './src/database/database'

connectDB()

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port: ${process.env.PORT}`)
})
