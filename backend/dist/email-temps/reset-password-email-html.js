"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordEmailHTML = void 0;
const constants_1 = require("../utils/constants");
const resetPasswordEmailHTML = (name, resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      border: 1px solid #ddd;
    }
    h2 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    a.button {
      display: inline-block;
      background-color: #ff4d4f;
      color: white !important;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    a.button:hover {
      background-color: #e43d3e;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password for your account at ${constants_1.APP_NAME}.</p>
    <p>Click the button below to reset your password. This link is valid for a limited time only.</p>
    <p>
      <a class="button" href="${resetLink}" target="_blank" rel="noopener noreferrer">
        Reset Password
      </a>
    </p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${constants_1.APP_NAME}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
exports.resetPasswordEmailHTML = resetPasswordEmailHTML;
