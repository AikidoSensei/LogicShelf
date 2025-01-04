import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { strict } from 'assert'
// import dotenv from 'dotenv'
// dotenv.config()

export const generateTokenSetCookie = (res:Response, userid:string)=>{
 const secretKey = process.env.MY_SECRET;
  if (!secretKey) {
    throw new Error('MY_SECRET is not defined in environment variables.');
  }
  const token = jwt.sign({ userid }, secretKey, {expiresIn: '7d'})

  res.cookie('token', token, {
   httpOnly: true,
   secure:process.env.NODE_ENV === 'production',
   sameSite: "strict",
   maxAge: 7 * 24 * 60 * 60,
  })
  return token
} 