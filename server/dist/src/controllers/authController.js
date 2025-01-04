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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.signUpStaff = exports.signUpOrganization = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateTokenSetCookie_1 = require("../utils/generateTokenSetCookie");
const email_1 = require("../emailHandler/email");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const signUpOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, organization } = req.body;
        if (!name || !email || !password || !organization) {
            res.status(400).json({ message: 'All fields need to be filled' });
            return;
        }
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const userExist = yield prisma.userAccount.findUnique({
                where: { email },
            });
            if (userExist) {
                throw new Error('User already exists');
            }
            const organizationRecord = yield prisma.organizations.create({
                data: {
                    name: organization,
                    createdBy: email,
                },
            });
            // Hash the user's password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Generate a verification token
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            // Create the user account
            const newUser = yield prisma.userAccount.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    verificationToken,
                    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
                    resetPasswordExpiresAt: null,
                    resetPasswordToken: null,
                    Users: {
                        create: {
                            name,
                            email,
                            role: 'ADMIN', // Default to admin for organization creator
                            organization: {
                                connect: {
                                    organizationId: organizationRecord.organizationId,
                                },
                            },
                        },
                    },
                },
            });
            yield (0, email_1.sendVerificationToken)(newUser.email, verificationToken);
            (0, generateTokenSetCookie_1.generateTokenSetCookie)(res, newUser.id);
            res.status(201).json({
                message: 'User and organization created successfully',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    organization: organizationRecord.name,
                },
            });
        }));
    }
    catch (error) {
        console.error('Error in signUp:', error);
        res.status(400).json({
            message: error.message || 'Something went wrong. Please try again.',
        });
    }
});
exports.signUpOrganization = signUpOrganization;
const signUpStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, organizationName } = req.body;
        if (!name || !email || !password || !organizationName) {
            res.status(400).json({ message: 'All fields need to be filled' });
            return;
        }
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const userExist = yield prisma.userAccount.findUnique({
                where: { email },
            });
            if (userExist) {
                throw new Error('User already exists');
            }
            // Check if the organization exists in my db
            const organizationRecord = yield prisma.organizations.findUnique({
                where: { name: organizationName },
            });
            if (!organizationRecord) {
                throw new Error('Organization does not exist');
            }
            // Check for a valid invitation in db
            const invitation = yield prisma.invitations.findFirst({
                where: {
                    email,
                    organizationId: organizationRecord.organizationId,
                    isAccepted: false,
                    expiresAt: { gt: new Date() },
                },
            });
            if (!invitation) {
                throw new Error('No valid invitation found for this email and organization');
            }
            // Hash user's password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Generate d verification token
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            // Create the user account and link it to the organization
            const newUser = yield prisma.userAccount.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    verificationToken,
                    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    resetPasswordExpiresAt: null,
                    resetPasswordToken: null,
                    Users: {
                        create: {
                            name,
                            email,
                            role: 'STAFF',
                            organization: {
                                connect: {
                                    organizationId: organizationRecord.organizationId,
                                },
                            },
                        },
                    },
                },
            });
            yield prisma.invitations.update({
                where: { id: invitation.id },
                data: { isAccepted: true },
            });
            yield (0, email_1.sendVerificationToken)(newUser.email, verificationToken);
            (0, generateTokenSetCookie_1.generateTokenSetCookie)(res, newUser.id);
            res.status(201).json({
                message: 'Staff account created successfully',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    organization: organizationRecord.name,
                },
            });
        }));
    }
    catch (error) {
        console.error('Error in signUpStaff:', error);
        res.status(400).json({
            message: error.message || 'Something went wrong. Please try again.',
        });
    }
});
exports.signUpStaff = signUpStaff;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        const user = yield prisma.userAccount.findFirst({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            res.status(400).json({ message: 'Verification code is invalid or expired' });
        }
        yield prisma.userAccount.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });
        const organization = yield prisma.organizations.findFirst({
            where: {
                createdBy: user === null || user === void 0 ? void 0 : user.email
            }
        });
        const org = (organization === null || organization === void 0 ? void 0 : organization.name) || '';
        yield (0, email_1.welcomeEmail)(user === null || user === void 0 ? void 0 : user.email, org);
        res.status(200).json({ success: true, message: 'Email verified successfully' });
    }
    catch (error) {
        console.log(error);
        throw new Error('Error email not verified');
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const user = yield prisma.userAccount.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: 'Wrong credentials provided'
            });
            return;
        }
        (0, generateTokenSetCookie_1.generateTokenSetCookie)(res, user.id);
        res.status(201).json({
            status: 'success',
            message: 'Login successful'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Validate email
        if (!email) {
            res.status(400).json({ message: 'Please provide an email' });
            return;
        }
        // Check if the user exists
        const user = yield prisma.userAccount.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ message: 'User does not exist' });
            return;
        }
        // Generate a reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        yield prisma.userAccount.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: resetTokenExpiresAt,
            },
        });
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        yield (0, email_1.sendPasswordReset)(email, resetLink);
        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent successfully. Please check your email.',
        });
    }
    catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your request. Please try again later.',
            error: error.message || 'Unexpected error',
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token) {
            throw new Error('Invalid token provided');
        }
        const user = yield prisma.userAccount.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { gt: new Date() }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired reset token sent');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield prisma.userAccount.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null
            }
        });
        yield (0, email_1.sendResetSuccess)(user.email, `${process.env.CLIENT_URL}/auth/login`);
        res.status(201).json({ success: true, message: 'Password Reset succesfull' });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.resetPassword = resetPassword;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.userAccount.findFirst({
            where: {
                id: req.userid,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.log("Error in authchecker function", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.checkAuth = checkAuth;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Successfully logged out'
    });
});
exports.logout = logout;
