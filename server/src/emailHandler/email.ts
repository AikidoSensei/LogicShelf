import { MailtrapClient } from 'mailtrap'
import { EMAIL_TEMPLATE } from './emailTemplate'
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
