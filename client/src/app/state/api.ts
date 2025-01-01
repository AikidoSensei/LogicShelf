import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
export interface Product {
	productId: string
	name: string
	price: number
	rating?: number
	stockQuantity: number
}
export interface Users{
	 userId: string 
  name:   string
  email:  string
}
export interface NewProduct {
	name: string
	price: number
	rating?: number
	stockQuantity: number
}
export interface SalesSummary {
	salesSummaryId: string
	totalValue: number
	changePercentage?: number
	date: string
}
export interface PurchaseSummary {
	purchaseSummaryId: string
	totalPurchased: number
	changePercentage?: number
	date: string
}
export interface ExpenseSummary {
	expenseSummaryId: string
	totalExpenses: number
	date: string
}
export interface ExpenseByCategorySummary {
	expenseByCategorySummaryId: string
	category: string
	amount: string
	date: string
}
export interface DashBoardMetrics {
	popularProducts: Product[]
	salesSummary: SalesSummary[]
	purchaseSummary: PurchaseSummary[]
	expenseSummary: ExpenseSummary[]
	expenseByCategorySummary: ExpenseByCategorySummary[]
}
export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
	reducerPath: 'api',
	tagTypes: ['DashboardMetrics', 'Products', 'Users'],
	endpoints: (build) => ({
		getMetrics: build.query<DashBoardMetrics, void>({
			query: () => '/dashboard',
			providesTags: ['DashboardMetrics'],
		}),
		getProducts: build.query<Product[], string | void>({
			query: (search) => ({
				url: '/products',
				params: search ? { search } : {},
			}), // i always forgeting param is an object
			providesTags: ['Products'],
		}),
		createProduct: build.mutation<Product, NewProduct>({
			query: (newProduct) => ({
				url: '/products',
				method: 'POST',
				body: newProduct,
			}),
			invalidatesTags: ['Products'],
		}),
		getUsers: build.query<Users[], string | void>({
			query: (search) => ({
				url: '/users',
				params: search ? { search } : {},
			}),
			providesTags: ['Users'],
		}),
	}),
})
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

export const { useGetMetricsQuery, useGetProductsQuery, useCreateProductMutation, useGetUsersQuery } = api
