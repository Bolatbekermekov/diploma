import express from 'express'
import { authUser, getUserProfile, registerUser } from '../controllers/user'
import { isAuthenticated } from './../middlewares/auth'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', authUser)

router.get('/me', isAuthenticated, getUserProfile)

export default router
