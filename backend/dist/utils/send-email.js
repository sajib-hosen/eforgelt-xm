"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Sends an email using Nodemailer.
 *
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param html - The HTML content of the email.
 */
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        /**
         * Send the email using the transporter.
         * The 'from' field combines a display name and an email address.
         */
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent to ${to}`);
    }
    catch (error) {
        // Log and rethrow any errors that occur during email sending
        console.error("❌ Email sending failed:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
