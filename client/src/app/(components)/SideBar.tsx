import {
	Archive,
	Container,
	Home,
	LucideIcon,
	Menu,
	PaintBucket,
	PoundSterling,
	Settings2,
	SidebarClose,
	User,
	User2,
} from 'lucide-react'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { setShowSideBar } from '../../state'

const SideBar = () => {
	const showSideBar = useAppSelector((state) => state.global.showSideBar)

	console.log(showSideBar)
	const dispatch = useAppDispatch()
	interface sideBarLinktypes {
		href: string
		label: string
		icon: LucideIcon
		sideBarOpen: boolean
	}
	const SideBarLink = ({
		href,
		label,
		icon: Icon,
		sideBarOpen,
	}: sideBarLinktypes) => {
		const pathname = usePathname()
		const activeLink =
			href === pathname || (pathname === '/' && href === '/dashboard')
		return (
			<Link href={href}>
				<div
					className={`flex items-center ${
						sideBarOpen
							? ' gap-3 px-3 py-2 '
							: ' justify-center py-3 w-full bg-pink-400 px-3 rounded-full font-medium h-full hover:scale-125 duration-200'
					} ${activeLink ? '' : ''}`}
				>
					<Icon
						className={`w-4 h-4  ${showSideBar ? 'text-black' : 'text-white '}`}
					/>
					<span
						className={`${
							sideBarOpen ? 'block text-black/50' : 'hidden'
						} text-md`}
					>
						{label}
					</span>
				</div>
			</Link>
		)
	}
	const sidebarCn = `fixed flex flex-col justify-between ${
		showSideBar
			? 'w-72 md:w-64'
			: ' items-center w-0 md:w-16 md:bg-[#761078] py-4 '
	} h-full transition-all duration-200 overflow-hidden shadow-md z-50  bg-white`
	return (
		<div className={sidebarCn}>
			{/* logo */}
			<div className='flex flex-col gap-10 '>
				<div className=' flex justify-between gap-2 py-4'>
					<p>Logo</p>
					<div
						className={`p-2 bg-slate-300 rounded-xl cursor-pointer ${
							showSideBar ? 'block' : 'hidden'
						}`}
						onClick={() => dispatch(setShowSideBar(false))}
					>
						<SidebarClose />
					</div>
				</div>

				{/* Links */}
				<div className={` flex flex-col gap-4  `}>
					<SideBarLink
						href='/dashboard'
						label='Dashboard'
						icon={Home}
						sideBarOpen={showSideBar}
					/>
					<SideBarLink
						href='/products'
						label='Products'
						icon={Container}
						sideBarOpen={showSideBar}
					/>
					<SideBarLink
						href='/inventory'
						label='Inventory'
						icon={Archive}
						sideBarOpen={showSideBar}
					/>
					<SideBarLink
						href='/finance'
						label='Finance'
						icon={PoundSterling}
						sideBarOpen={showSideBar}
					/>
					<SideBarLink
						href='/users'
						label='Users'
						icon={User2}
						sideBarOpen={showSideBar}
					/>
					<SideBarLink
						href='/settings'
						label='Settings'
						icon={Settings2}
						sideBarOpen={showSideBar}
					/>
				</div>
			</div>
			{/* Footer */}
			<footer className='w-full'>footer</footer>
		</div>
	)
}

export default SideBar
