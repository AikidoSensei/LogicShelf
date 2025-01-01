import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma  = new PrismaClient()
export const getUsers = async(req:Request, res:Response):Promise<void>=>{
try {
 const search = req.query.search?.toString()
 const users = await prisma.users.findMany(
  {where:{
     name:{
      contains:search,
      mode:'insensitive'
     }
    },
    orderBy:{
      name:'desc'
    }}
 );
 if(!users){
  res.status(200).json({message: 'No users found'})
 }
 res.status(200).json(users)
} catch (error) {
 console.log(error)
 res.status(500).json({message:'Something went wrong'})
}
finally{prisma.$disconnect()}
}