import { EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_TEMPLATE } from './emailTemplate'
import { client, sender } from './mailtrap.config'
export const sendVerificationToken = async (
	email: string,
	token: string
): Promise<void> => {
	const recipients = [{ email }]
	try {
		const response = await client.send({
			from: sender,
			to: recipients,
			subject: 'Verify your email',
			html: EMAIL_TEMPLATE.replace('{verificationtoken}', token),
			category: 'Email Verification',
		})
  console.log('sent', response)
	} catch (error) {
		console.log(error)
	}
}
export const sendPasswordReset = async (email:string, resetUrl:string):Promise<void>=>{
const recipients = [{email}]
try {
	const response = await client.send({
		from: sender,
		to: recipients,
		subject: 'Forgot password',
		html: PASSWORD_RESET_TEMPLATE.replace(
			'{{pass_reset_link}}',
			resetUrl
		).replace('{{user_email}}', email),
		category: 'Forgot password',
	})
	console.log('sent', response)
} catch (error) {
	console.log(error)
}
}
export const sendResetSuccess = async(email:string, loginUrl:string):Promise<void>=>{
	const recipients = [{ email }]
	try {
		const response = await client.send({
			from: sender,
			to: recipients,
			subject: 'Password reset successful',
			html: PASSWORD_RESET_SUCCESS.replace('{{next_step_link}}', loginUrl),
			category: 'Password reset successful',
		})
		console.log('sent', response)
	} catch (error) {
		console.log(error)
	}
}
export const welcomeEmail = async (email:any, organization:string):Promise<void>=>{
	const recipients = [{email}]
	try {
				const response = await client.send({
					from: sender,
					to: recipients,
					template_uuid: '19a1bd59-4eb2-4580-8656-f641b20e6fc9',
					template_variables: {
						name: organization,
					},
				})
				console.log('succesfully sent welcome email', response)
	} catch (error) {
		console.log(error)
		throw new Error ('Email sending failed')
	}
}
