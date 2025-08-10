"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationEmailHTML = void 0;
const constants_1 = require("../utils/constants");
const verificationEmailHTML = (name, verificationLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
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
      background-color: #4CAF50;
      color: white !important;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    a.button:hover {
      background-color: #45a049;
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
    <h2>Verify Your Email</h2>
    <p>Hi ${name},</p>
    <p>Thank you for registering! Please confirm your email address by clicking the button below.</p>
    <p>
      <a class="button" href="${verificationLink}" target="_blank">
        Verify Email
      </a>
    </p>
    <p>If you didn’t create this account, you can ignore this message.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${constants_1.APP_NAME}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
exports.verificationEmailHTML = verificationEmailHTML;
