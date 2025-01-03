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
exports.logout = exports.login = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateTokenSetCookie_1 = require("../utils/generateTokenSetCookie");
const email_1 = require("../emailHandler/email");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the fields
        const { name, email, password, organization } = req.body;
        if (!name || !email || !password || !organization) {
            res.status(400).json({ message: 'All fields need to be filled' });
            return;
        }
        // Check if user already exists
        const userExist = yield prisma.userAccount.findUnique({
            where: { email },
        });
        if (userExist) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Check if organization exists
        let organizationRecord = yield prisma.organizations.findUnique({
            where: { name: organization },
        });
        if (!organizationRecord) {
            organizationRecord = yield prisma.organizations.create({
                data: {
                    name: organization,
                    createdBy: email,
                },
            });
        }
        else {
            res.status(400).json({ message: 'Organization already exist', organizationRecord });
        }
        // Hash the user's password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // Create the user account and associate it with the organization
        const newUser = yield prisma.userAccount.create({
            data: {
                email,
                password: hashedPassword,
                name,
                verificationToken,
                verificationTokenExpiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
                resetPasswordExpiresAt: '',
                resetPasswordToken: '',
                Users: {
                    create: {
                        name,
                        email,
                        role: organizationRecord.createdBy === email ? 'ADMIN' : 'STAFF',
                        organization: {
                            connect: {
                                organizationId: organizationRecord.organizationId,
                            },
                        },
                    },
                },
            },
        });
        (0, generateTokenSetCookie_1.generateTokenSetCookie)(res, newUser.id);
        yield (0, email_1.sendVerificationToken)(newUser.email, verificationToken);
        res
            .status(201)
            .json({ message: 'User and organization created successfully', user: { user: newUser.name, email: newUser.email, organization: organizationRecord.name } });
    }
    catch (error) {
        console.error('Error in signUp:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('login route reached');
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('logout route reached');
});
exports.logout = logout;
