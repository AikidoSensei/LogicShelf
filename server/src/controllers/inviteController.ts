import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()
export const sendInvitation = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email, organizationId }: { email: string; organizationId: string } =
		req.body

	try {
		const organization = await prisma.organizations.findUnique({
			where: { organizationId },
		})
		if (!organization) {
			res.status(400).json({ message: 'Organization does not exist' })
			return
		}

		const invitation = await prisma.invitations.create({
			data: {
				email,
				organizationId: organization.organizationId,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
				isAccepted: false,
			},
		})

		// await sendInvitationEmail(email, organization.name)
		res
			.status(200)
			.json({ message: 'Invitation sent successfully', invitation })
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Failed to send invitation', error: error.message })
	}
}
