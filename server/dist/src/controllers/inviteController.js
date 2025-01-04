"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitation = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sendInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, organizationId } = req.body;
    try {
        const organization = yield prisma.organizations.findUnique({
            where: { organizationId },
        });
        if (!organization) {
            res.status(400).json({ message: 'Organization does not exist' });
            return;
        }
        const invitation = yield prisma.invitations.create({
            data: {
                email,
                organizationId: organization.organizationId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
                isAccepted: false,
            },
        });
        // await sendInvitationEmail(email, organization.name)
        res
            .status(200)
            .json({ message: 'Invitation sent successfully', invitation });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Failed to send invitation', error: error.message });
    }
});
exports.sendInvitation = sendInvitation;
