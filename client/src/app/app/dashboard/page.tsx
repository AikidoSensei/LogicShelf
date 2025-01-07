'use client'
import React from 'react'
import MyPopularProducts from './MyPopularProducts'
import MySalesSummary from './MySalesSummary'
import MyPurchaseSummary from './MyPurchaseSummary'
import MyExpenseSummary from './MyExpenseSummary'
import CardInfo from './CardInfo'
import {
	CheckCircle,
	Package,
	Tag,
	TrendingDown,
	TrendingUp,
} from 'lucide-react'

type Props = {}

const Dashboard = (props: Props) => {
	return (
		<div className='grid gird-col-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 my-grid-rows py-4 text-black'>
			<MyPopularProducts />
			<MySalesSummary />
			<MyPurchaseSummary />
			<MyExpenseSummary />
			<CardInfo
				title='Customer & Expenses'
				primaryIcon={<Package className='text-blue-600 w-6 h-6' />}
				dateRange='22 - 29 October 2023'
				details={[
					{
						title: 'Customer Growth',
						amount: '175.00',
						changePercentage: 131,
						IconComponent: TrendingUp,
					},
					{
						title: 'Expenses',
						amount: '10.00',
						changePercentage: -56,
						IconComponent: TrendingDown,
					},
				]}
			/>
			<CardInfo
				title='Dues & Pending Orders'
				primaryIcon={<CheckCircle className='text-blue-600 w-6 h-6' />}
				dateRange='22 - 29 October 2023'
				details={[
					{
						title: 'Dues',
						amount: '250.00',
						changePercentage: 131,
						IconComponent: TrendingUp,
					},
					{
						title: 'Pending Orders',
						amount: '147',
						changePercentage: -56,
						IconComponent: TrendingDown,
					},
				]}
			/>
			<CardInfo
				title='Sales & Discount'
				primaryIcon={<Tag className='text-blue-600 w-6 h-6' />}
				dateRange='22 - 29 October 2023'
				details={[
					{
						title: 'Sales',
						amount: '1000.00',
						changePercentage: 20,
						IconComponent: TrendingUp,
					},
					{
						title: 'Discount',
						amount: '200.00',
						changePercentage: -10,
						IconComponent: TrendingDown,
					},
				]}
			/>
		</div>
	)
}

export default Dashboard
