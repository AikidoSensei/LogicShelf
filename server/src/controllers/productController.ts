import { PrismaClient } from "@prisma/client";
import {Request, Response} from 'express'
const prisma = new PrismaClient()
export const getProducts = async (req:Request, res:Response):Promise<void>=>{
 try {
  const search  = req.query.search?.toString();
 const product =  await prisma.products.findMany({
    where:{
     name:{
      contains:search,
      mode:'insensitive'
     }
    },
    orderBy:{
      name:'desc'
    }
  })
  res.json(product)
 } catch (error) {
  res.status(500).json({message:'Could not retrieve product'}) 
 }finally{await prisma.$disconnect()}
}

export const createProduct = async (req:Request, res:Response):Promise<void>=>{
  try {
		const { productId, name, price, rating, stockQuantity, createdBy } = req.body
		await prisma.products.create({
			data: {
				productId,
				name,
				price,
				rating,
				stockQuantity,
				createdBy,
			},
		})
		res.status(201).json({ message: `${name} has been created successfully` })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Could not retrieve product',error },)
	} finally {
		await prisma.$disconnect()
	}
}