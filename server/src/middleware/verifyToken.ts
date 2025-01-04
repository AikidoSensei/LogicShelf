import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import 'express'

declare module 'express' {
	export interface Request {
		userid?: string 
	}
}
dotenv.config()
export const verifyToken = (req:Request, res:Response, next:NextFunction):void=>{
 const token = req.cookies?.token;
 
  if (!token){ res.status(401).json({ success: false,message:'Unauthorized: No token provided' });
 return
 }
 try {
		const secretKey = process.env.MY_SECRET
		if (!secretKey) {
			throw new Error('MY_SECRET is not defined in environment variables.')
		}
		const decoded = jwt.verify(token, secretKey) as { userid: string }
		req.userid = decoded.userid
		return next()
 } catch (error) {
		console.error('Error verifying token:', error)
		 res.status(401).json({ success: false, message: 'Invalid or expired token' })
   return
 }
}