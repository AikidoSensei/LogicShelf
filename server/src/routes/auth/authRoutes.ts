import { Router } from "express";
import { login, logout, verifyEmail, signUpOrganization, signUpStaff, forgotPassword, resetPassword, checkAuth } from "../../controllers/authController";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();


router.get('/check-auth', verifyToken, checkAuth)
router.post('/login', login)
router.post('/signup-org', signUpOrganization)
router.post('/signup-staff', signUpStaff)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/logout', logout)


export default router