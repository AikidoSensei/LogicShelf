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
exports.welcomeEmail = exports.sendResetSuccess = exports.sendPasswordReset = exports.sendVerificationToken = void 0;
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
const sendPasswordReset = (email, resetUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const recipients = [{ email }];
    try {
        const response = yield mailtrap_config_1.client.send({
            from: mailtrap_config_1.sender,
            to: recipients,
            subject: 'Forgot password',
            html: emailTemplate_1.PASSWORD_RESET_TEMPLATE.replace('{{pass_reset_link}}', resetUrl).replace('{{user_email}}', email),
            category: 'Forgot password',
        });
        console.log('sent', response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendPasswordReset = sendPasswordReset;
const sendResetSuccess = (email, loginUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const recipients = [{ email }];
    try {
        const response = yield mailtrap_config_1.client.send({
            from: mailtrap_config_1.sender,
            to: recipients,
            subject: 'Password reset successful',
            html: emailTemplate_1.PASSWORD_RESET_SUCCESS.replace('{{next_step_link}}', loginUrl),
            category: 'Password reset successful',
        });
        console.log('sent', response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendResetSuccess = sendResetSuccess;
const welcomeEmail = (email, organization) => __awaiter(void 0, void 0, void 0, function* () {
    const recipients = [{ email }];
    try {
        const response = yield mailtrap_config_1.client.send({
            from: mailtrap_config_1.sender,
            to: recipients,
            template_uuid: '19a1bd59-4eb2-4580-8656-f641b20e6fc9',
            template_variables: {
                name: organization,
            },
        });
        console.log('succesfully sent welcome email', response);
    }
    catch (error) {
        console.log(error);
        throw new Error('Email sending failed');
    }
});
exports.welcomeEmail = welcomeEmail;
