import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

export const getMetrics = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const popularProducts = await prisma.products.findMany({
			take: 15,
			orderBy: {
				stockQuantity: 'desc',
			},
		})
		const salesSummary = await prisma.salesSummary.findMany({
			take: 5,
			orderBy: { date: 'desc' },
		})
		const purchaseSummary = await prisma.purchaseSummary.findMany({
			take: 5,
			orderBy: { date: 'desc' },
		})
		const expenseSummary = await prisma.expenseSummary.findMany({
			take: 5,
			orderBy: { date: 'desc' },
		})
		const expenseByCartegorySummaryRaw =
			await prisma.expenseByCategory.findMany({
				take: 5,
				orderBy: { date: 'desc' },
			})

		const expenseByCategorySummary = expenseByCartegorySummaryRaw.map((item) => ({
			...item,
			amount: item.amount.toString(),
		}))

		//  const expenseByCategory = expenseByCartegorySummaryRaw.map((item)=>{
		//   return {...item, amount:item.amount.toString()}
		//  })
		res.json({
			popularProducts,
			salesSummary,
			purchaseSummary,
			expenseSummary,
			expenseByCategorySummary,
		})
	} catch (error) {
		console.error(error)
	}
}
