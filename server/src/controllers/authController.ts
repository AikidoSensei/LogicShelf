import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { generateTokenSetCookie } from '../utils/generateTokenSetCookie'
import { sendPasswordReset, sendResetSuccess, sendVerificationToken, welcomeEmail } from '../emailHandler/email'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

type SignUpData = {
	name: string
	email: string
	password: string
	organization: string
}
type SignUpDataStaff = {
	name: string
	email: string
	password: string
	organizationName: string
}
export const signUpOrganization = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, password, organization }: SignUpData = req.body

		if (!name || !email || !password || !organization) {
			res.status(400).json({ message: 'All fields need to be filled' })
			return
		}

		await prisma.$transaction(async (prisma) => {
			const userExist = await prisma.userAccount.findUnique({
				where: { email },
			})
			if (userExist) {
				throw new Error('User already exists')
			}

			const organizationRecord = await prisma.organizations.create({
				data: {
					name: organization,
					createdBy: email,
				},
			})

			// Hash the user's password
			const hashedPassword = await bcrypt.hash(password, 10)

			// Generate a verification token
			const verificationToken = Math.floor(
				100000 + Math.random() * 900000
			).toString()

			// Create the user account
			const newUser = await prisma.userAccount.create({
				data: {
					email,
					password: hashedPassword,
					name,
					verificationToken,
					verificationTokenExpiresAt: new Date(
						Date.now() + 24 * 60 * 60 * 1000
					), // Expires in 24 hours
					resetPasswordExpiresAt: null,
					resetPasswordToken: null,
					Users: {
						create: {
							name,
							email,
							role: 'ADMIN', // Default to admin for organization creator
							organization: {
								connect: {
									organizationId: organizationRecord.organizationId,
								},
							},
						},
					},
				},
			})

			await sendVerificationToken(newUser.email, verificationToken)
			generateTokenSetCookie(res, newUser.id)

			res.status(201).json({
				message: 'User and organization created successfully',
				user: {
					name: newUser.name,
					email: newUser.email,
					organization: organizationRecord.name,
				},
			})
		})
	} catch (error: any) {
		console.error('Error in signUp:', error)
		res.status(400).json({
			message: error.message || 'Something went wrong. Please try again.',
		})
	}
}

export const signUpStaff = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { name, email, password, organizationName }: SignUpDataStaff =
			req.body

		if (!name || !email || !password || !organizationName) {
			res.status(400).json({ message: 'All fields need to be filled' })
			return
		}

		await prisma.$transaction(async (prisma) => {

			const userExist = await prisma.userAccount.findUnique({
				where: { email },
			})
			if (userExist) {
				throw new Error('User already exists')
			}

			// Check if the organization exists in my db
			const organizationRecord = await prisma.organizations.findUnique({
				where: { name: organizationName },
			})
			if (!organizationRecord) {
				throw new Error('Organization does not exist')
			}

			// Check for a valid invitation in db
			const invitation = await prisma.invitations.findFirst({
				where: {
					email,
					organizationId: organizationRecord.organizationId,
					isAccepted: false,
					expiresAt: { gt: new Date() },
				},
			})
			if (!invitation) {
				throw new Error(
					'No valid invitation found for this email and organization'
				)
			}

			// Hash user's password
			const hashedPassword = await bcrypt.hash(password, 10)

			// Generate d verification token
			const verificationToken = Math.floor(
				100000 + Math.random() * 900000
			).toString()

			// Create the user account and link it to the organization
			const newUser = await prisma.userAccount.create({
				data: {
					email,
					password: hashedPassword,
					name,
					verificationToken,
					verificationTokenExpiresAt: new Date(
						Date.now() + 24 * 60 * 60 * 1000
					), 
					resetPasswordExpiresAt: null,
					resetPasswordToken: null,
					Users: {
						create: {
							name,
							email,
							role: 'STAFF', 
							organization: {
								connect: {
									organizationId: organizationRecord.organizationId,
								},
							},
						},
					},
				},
			})

			await prisma.invitations.update({
				where: { id: invitation.id },
				data: { isAccepted: true },
			})

			await sendVerificationToken(newUser.email, verificationToken)
			generateTokenSetCookie(res, newUser.id)

			res.status(201).json({
				message: 'Staff account created successfully',
				user: {
					name: newUser.name,
					email: newUser.email,
					organization: organizationRecord.name,
				},
			})
		})
	} catch (error: any) {
		console.error('Error in signUpStaff:', error)
		res.status(400).json({
			message: error.message || 'Something went wrong. Please try again.',
		})
	}
}

export const verifyEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { code } = req.body
	
	try {
		const user = await prisma.userAccount.findFirst({
			where: {
				verificationToken: code,
				verificationTokenExpiresAt: { gt: new Date() },
			},
		})
		if (!user) {
			res.status(400).json({ message: 'Verification code is invalid or expired' })
		}
	
		await prisma.userAccount.update({
			where: {
				id: user?.id,
			},
			data: {
				isVerified: true,
				verificationToken: null,
				verificationTokenExpiresAt: null,
			},
		})
		const organization =  await prisma.organizations.findFirst({
			where:{
				createdBy:user?.email
			}
		})
		const org = organization?.name || '';
	
		await	welcomeEmail(user?.email, org)
		res.status(200).json({success: true, message:'Email verified successfully'})
		
	} catch (error) {
		console.log(error)
		throw new Error('Error email not verified')
	}
}

export const login = async (req: Request, res: Response): Promise<void> => { 
	try {
		const {email, password} =req.body
		if(!email || !password){
		 res.status(400).json({message:'Invalid credentials'})
			return
		}
		const user = await prisma.userAccount.findUnique({
			where:{email}
		})
		if (!user){
		 res.status(400).json({ message: 'User does not exist' })
			return
		}
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if(!isPasswordValid){
			res.status(400).json({
				message: 'Wrong credentials provided' 
			})
			return
		}
		generateTokenSetCookie(res, user.id)
		res.status(201).json({
			status:'success',
			message: 'Login successful'
		})
	} catch (error) {
		res.status(500).json({message:'something went wrong'})
	}
}

export const forgotPassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email } = req.body

		// Validate email
		if (!email) {
			res.status(400).json({ message: 'Please provide an email' })
			return
		}

		// Check if the user exists
		const user = await prisma.userAccount.findUnique({
			where: { email },
		})
		if (!user) {
			res.status(404).json({ message: 'User does not exist' })
			return
		}

		// Generate a reset token
		const resetToken = crypto.randomBytes(32).toString('hex')
		const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000) 

		await prisma.userAccount.update({
			where: { email },
			data: {
				resetPasswordToken: resetToken,
				resetPasswordExpiresAt:resetTokenExpiresAt,
			},
		})

		const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
		await sendPasswordReset(email, resetLink)

		res.status(200).json({
			status: 'success',
			message:
				'Password reset link sent successfully. Please check your email.',
		})
	} catch (error: any) {
		console.error('Error in forgotPassword:', error)

		res.status(500).json({
			status: 'error',
			message:
				'An error occurred while processing your request. Please try again later.',
			error: error.message || 'Unexpected error',
		})
	}
}

export const resetPassword = async (req: Request, res: Response):Promise<void>=>{
	try {
		const {token} = req.params;
		const {password} = req.body
		if (!token){
			throw new Error('Invalid token provided')
		}
		const user =  await prisma.userAccount.findFirst({
			where:{
				resetPasswordToken:token,
				resetPasswordExpiresAt:{ gt: new Date() }
			}
		})
		if (!user){
			throw new Error('Invalid or expired reset token sent')
		}
		const hashedPassword = await bcrypt.hash(password,  10)
		await prisma.userAccount.update({
			where:{
				id: user.id
			},
			data:{
				password:hashedPassword,
				resetPasswordToken:null,
				resetPasswordExpiresAt:null
			}

		})
		await sendResetSuccess(
			user.email,
			`${process.env.CLIENT_URL}/auth/login`
		)
		res.status(201).json({success:true,message:'Password Reset succesfull'})
	} catch (error) {
		res.status(400).json(error)
	}
}

export const checkAuth = async (req:Request, res:Response):Promise<void>=>{
	try {
		const user = await prisma.userAccount.findFirst({
			where: {
				id: req.userid,
			},
			select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
			},
		})
		if (!user){
			 res.status(400).json({success:false, message:"User not found"})
				return
		}
		res.status(200).json({success:true, user})
	} catch (error:any) {
		console.log("Error in authchecker function", error)
		res.status(400).json({success:false, message:error.message})
	}
}

export const logout = async (req: Request, res: Response): Promise<void> => {
	res.clearCookie('token')
	res.status(200).json({
		message:'Successfully logged out'
	})
}
