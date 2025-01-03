import dotenv from 'dotenv'

dotenv.config()
const { MailtrapClient } = require('mailtrap')
const TOKEN = '5a82dc12052f66ec22b350e260f8fc4b'

export const client = new MailtrapClient({
	token: TOKEN,
})

export const sender = {
	email: 'hello@demomailtrap.com',
	name: 'Logic Shelf',
}



