"use client"
import React, { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useVerifyEmailMutation } from '@/state/api'
// import { useAuthStore } from '../store/authStore'
// import toast from 'react-hot-toast'
  interface ApiErrorResponse {
		message: string
	}
const EmailVerificationPage = () => {
	const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const router = useRouter()
  const [verifyEmail,{data, isLoading, error,isSuccess}] = useVerifyEmailMutation()

	// const { error, isLoading, verifyEmail } = useAuthStore()

	const handleChange = (index: number, value: string) => {
		const newCode = [...code]

		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split('')
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || ''
			}
			setCode(newCode)

			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '')
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
			const input = inputRefs.current[focusIndex]
			if (input) {
				input.focus()
			}
		} else {
			newCode[index] = value
			setCode(newCode)

			if (value && index < 5) {
				const input = inputRefs.current[index + 1]
				if (input) {
					input.focus()
				}
			}
		}
	}


	const handleKeyDown = (index: number, e: KeyboardEvent) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			const input = inputRefs.current[index - 1]
			if (input) {
				input.focus()
			}
		}
	}


	const handleSubmit = async (e?:React.FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault()
		const verificationCode = code.join('')
		try {
		const response =	await verifyEmail({code:verificationCode}).unwrap()
      console.log(response);
      
			if (isSuccess) {
				router.push('/auth/login')
			}
		} catch (error) {
			console.log(error)
		}
	}

  const getErrorMessage = () => {
		if (!error) return null

		if ('status' in error) {
			if (typeof error.data === 'string') {
				return error.data
			} else if (typeof error.data === 'object' && error.data !== null) {
				const errorMsg = (error.data as ApiErrorResponse).message
				return errorMsg || 'Invalid Token Provided'
			} else {
				return `Error: ${error.status}`
			}
		}

		if ('message' in error) {
			return error.message
		}

		return 'An unknown error occurred.'
	}
	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== '')) {
			handleSubmit()
		}
	}, [code])
useEffect(()=>{
  if (isSuccess) {
    router.push('/auth/login')
  }
  
},[isSuccess])
	return (
		<div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray-300 mb-6'>
					Enter the 6-digit code sent to your email address.
				</p>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(e: HTMLInputElement | null) =>
									(inputRefs.current[index] = e)
								}
								type='text'
								maxLength={6}
								value={digit}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleChange(index, e.target.value)
								}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
							/>
						))}
					</div>
					{error && (
						<p className='text-red-500 font-semibold mt-2'>
							{getErrorMessage()}
						</p>
					)}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className={`w-full ${
							error
								? 'bg-gradient-to-r from-red-500 to-red-600'
								: 'bg-gradient-to-r from-green-500 to-emerald-600'
						} text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50`}
					>
						{isLoading ? 'Verifying...' : 'Verify'}
				
					</motion.button>
				</form>
			</motion.div>
		</div>
	)
}
export default EmailVerificationPage
