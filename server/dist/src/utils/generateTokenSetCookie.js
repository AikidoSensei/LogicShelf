"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv from 'dotenv'
// dotenv.config()
const generateTokenSetCookie = (res, userid) => {
    const secretKey = process.env.MY_SECRET;
    if (!secretKey) {
        throw new Error('MY_SECRET is not defined in environment variables.');
    }
    const token = jsonwebtoken_1.default.sign({ userid }, secretKey, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
    });
    return token;
};
exports.generateTokenSetCookie = generateTokenSetCookie;
