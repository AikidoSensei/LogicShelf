"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MailtrapClient } = require('mailtrap');
const TOKEN = '5a82dc12052f66ec22b350e260f8fc4b';
exports.client = new MailtrapClient({
    token: TOKEN,
});
exports.sender = {
    email: 'hello@demomailtrap.com',
    name: 'Logic Shelf',
};
