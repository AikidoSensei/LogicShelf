'use client'
import React from 'react'
import SideBar from '../(components)/SideBar'
import NavBar from '../(components)/NavBar'
import StoreProvider, { useAppSelector } from '../redux'

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  const showSideBar = useAppSelector((state)=>state.global.showSideBar)
	return (
		<div className='w-screen min-h-screen h-full flex'>
			<SideBar />
			<div className='flex flex-col w-full '>
				<main
					className={`flex flex-col w-full h-full py-7 px-9 bg-gray-100 ${
						showSideBar ? 'md:pl-72' : 'md:pl-24'
					}`}
				>
					<NavBar />
					{children}
				</main>
			</div>
		</div>
	)
}
const DashBoardWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<StoreProvider>
			<DashBoardLayout>{children}</DashBoardLayout>
		</StoreProvider>
	)
}

export default DashBoardWrapper
