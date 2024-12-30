"use client"
import React from 'react'
import MyPopularProducts from './MyPopularProducts'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className='grid gird-col-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 my-grid-rows py-4'>
      <MyPopularProducts/>
      <div className='row-span-3 xl:row-span-6 bg-blue-200 '/>
      <div className='row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-blue-200 '/>
      <div className='row-span-3 bg-gray-500'/>
      <div className='md:row-span-3 xl:row-span-2  bg-blue-200'/>
      <div className='md:row-span-3 xl:row-span-2  bg-blue-200'/>
      <div className='md:row-span-3 xl:row-span-2  bg-blue-200'/>
    </div>
  )
}

export default Dashboard