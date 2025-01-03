import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie";
import { sendVerificationToken } from "../emailHandler/email";
const prisma  = new PrismaClient()

type SignUpData = {
 name: string
 email: string
 password: string
 organization: string
}
export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		// Validate the fields
		const { name, email, password, organization }: SignUpData = req.body

		if (!name || !email || !password || !organization) {
			res.status(400).json({ message: 'All fields need to be filled' })
			return
		}

		// Check if user already exists
		const userExist = await prisma.userAccount.findUnique({
			where: { email },
		})
		if (userExist) {
			res.status(400).json({ message: 'User already exists' })
			return
		}

		// Check if organization exists
		let organizationRecord = await prisma.organizations.findUnique({
			where: { name: organization },
		})

		if (!organizationRecord) {
			organizationRecord = await prisma.organizations.create({
				data: {
					name: organization,
					createdBy: email,
				},
			})
		}
  else{
   res.status(400).json({message:'Organization already exist', organizationRecord})
  }

		// Hash the user's password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Generate a verification token
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString()

		// Create the user account and associate it with the organization
		const newUser = await prisma.userAccount.create({
			data: {
				email,
				password: hashedPassword,
				name,
				verificationToken,
				verificationTokenExpiresAt: new Date(
					new Date().getTime() + 24 * 60 * 60 * 1000
				).toISOString(), // Expires in 24 hours
				resetPasswordExpiresAt: '',
				resetPasswordToken: '',
				Users: {
					create: {
						name,
						email,
						role: organizationRecord.createdBy === email ? 'ADMIN' : 'STAFF', 
						organization: {
							connect: {
								organizationId: organizationRecord.organizationId,
							},
						},
					},
				},
			},
		})
   generateTokenSetCookie(res, newUser.id)
  await sendVerificationToken(newUser.email, verificationToken)
		res
			.status(201)
			.json({message:'User and organization created successfully', user:{user:newUser.name, email:newUser.email, organization:organizationRecord.name}})
	} catch (error) {
		console.error('Error in signUp:', error) 
		res.status(500).json({ message: 'Something went wrong. Please try again.' })
	}
}
export const login = async (req:Request, res:Response):Promise<void>=>{
 res.send('login route reached')
}
export const logout = async (req:Request, res:Response):Promise<void>=>{
 res.send('logout route reached')
}