"use client"
import { motion } from 'framer-motion'
import Input from '../../(components)/Input'
import { Group, Loader, Lock, Mail, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PasswordMeter from '../../(components)/PasswordMeter'
import Link from 'next/link'
import { useSignUpOrgMutation } from '@/state/api'
import { useRouter } from 'next/navigation'
// import { useAuthStore } from '../store/authStore'

export interface SignUpBody {
	name: string
	email: string
	password: string
	organization: string
}
const SignUpOrg = () => {
	const router = useRouter()
	const [signUpOrg, { isLoading, data, error, isSuccess }] =
		useSignUpOrgMutation()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [organization, setOrganization] = useState('')
  
interface ApiErrorResponse{
	message:string
}
	const getErrorMessage = () => {
		if (!error) return null

		if ('status' in error) {
			if (typeof error.data === 'string') {
				return error.data 
			} else if (typeof error.data === 'object' && error.data !== null) {
				const errorMsg = (error.data as ApiErrorResponse).message
				return errorMsg || 'Something went wrong'
			} else {
				return `Error: ${error.status}`
			}
		}

		if ('message' in error) {
			return error.message
		}

		return 'An unknown error occurred.'
	}

	const handleSignUpOrg = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const result = await signUpOrg({
				name,
				email,
				password,
				organization,
			}).unwrap()

			if (isSuccess) {
				router.push('/auth/verify-email')
			}
		} catch (error) {
			console.log('Error during signup:', error) 
		}
	}
useEffect(()=>{
	if (isSuccess) {
		router.push('/auth/verify-email')
	}
},[isSuccess])
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Create Account
				</h2>

				<form onSubmit={handleSignUpOrg}>
					<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setName(e.target.value)
						}
					/>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setEmail(e.target.value)
						}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPassword(e.target.value)
						}
					/>
					<Input
						icon={Group}
						type='text'
						placeholder='Organization Name'
						value={organization}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setOrganization(e.target.value)
						}
					/>
					{error && (
						<p className='text-red-500 font-semibold mt-2'>
							{getErrorMessage()}
						</p>
					)}
					<PasswordMeter password={password} />

					<motion.button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader className=' animate-spin mx-auto' size={24} />
						) : (
							'Sign Up'
						)}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?
					<Link
						href={'auth/login'}
						className='text-green-400 hover:underline'
					></Link>
				</p>
			</div>
		</motion.div>
	)
}
export default SignUpOrg
