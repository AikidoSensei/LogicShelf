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
exports.sendVerificationToken = void 0;
const emailTemplate_1 = require("./emailTemplate");
const mailtrap_config_1 = require("./mailtrap.config");
const sendVerificationToken = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const recipients = [{ email }];
    try {
        const response = yield mailtrap_config_1.client.send({
            from: mailtrap_config_1.sender,
            to: recipients,
            subject: 'Verify your email',
            html: emailTemplate_1.EMAIL_TEMPLATE.replace('{verificationtoken}', token),
            category: 'Email Verification',
        });
        console.log('sent', response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendVerificationToken = sendVerificationToken;
