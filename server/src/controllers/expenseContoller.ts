import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient()

export const getExpenses = async (req:Request, res:Response):Promise<void>=>{
 try {
  const expenseCategoryUnformatted = await prisma.expenseByCategory.findMany({
   orderBy:{
    date:'desc'
   }
  })
  const expenseCategory = expenseCategoryUnformatted.map((item)=>({...item, amount:item.amount.toString()}))
  res.status(200).json(expenseCategory)
 } catch (error) {
  res.status(500).json({message:'Could not get expense by category'})
  
 }finally{prisma.$disconnect}
}