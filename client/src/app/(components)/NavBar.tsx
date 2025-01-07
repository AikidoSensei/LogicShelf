import { Bell, Menu, Settings } from 'lucide-react'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux'
import { setShowSideBar } from '../../state'

const NavBar = () => {
	const showSideBar = useAppSelector((state) => state.global.showSideBar)
	const dispatch = useAppDispatch()
	return (
		<div className='w-full h-14  flex justify-between items-center px-4 py-2'>
			{/* search and nav controler */}
			<div className='w-1/2 flex items-center gap-2 h-full'>
				<div
					className='border border-black/50 rounded-full flex items-center justify-between p-2 text-black/50'
					onClick={() => dispatch(setShowSideBar(true))}
				>
					<Menu />
				</div>
				<div className='flex items-center gap-3 border border-slate-900 h-10 rounded-xl px-3 w-full max-w-[400px] text-black/50'>
					<Bell />
					<input
						type='text'
						className='outline-none border-none w-full '
						placeholder='type to search for goods and products'
					/>
				</div>
			</div>
			{/* items */}
			<div className=' flex items-center gap-6 text-black'>
				<div className='flex items center gap-6'>
					<div className='relative p-1 w-10 h-10 '>
						<Bell />
						<span className='absolute -top-2 right-0 items-center justify-center text-xs bg-red-500 rounded-full inline-flex p-1 h-4 w-4'>
							2
						</span>
					</div>
					<hr className='w-0 h-7 bg-black/50 border border-black/50' />
					{/* user profile */}
					<div className='rounded-full border '>user</div>
				</div>
				{/* settings */}
				<div className='w-full text-black'>
					<Settings />
				</div>
			</div>
		</div>
	)
}

export default NavBar
