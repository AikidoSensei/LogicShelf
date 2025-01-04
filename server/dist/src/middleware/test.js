"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express");
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: 'Unauthorized: No token provided' });
    }
    try {
        const secretKey = process.env.MY_SECRET;
        if (!secretKey) {
            throw new Error('MY_SECRET is not defined in environment variables.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.userid = decoded.userid;
        return next(); // Call next middleware
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res
            .status(401)
            .json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
