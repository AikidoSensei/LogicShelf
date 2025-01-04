import { Router } from 'express'
import { sendInvitation } from '../../controllers/inviteController'

const router = Router()

router.post('/invite-user', sendInvitation )

export default router