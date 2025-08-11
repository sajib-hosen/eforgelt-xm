import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  toEmail: string,
  htmlString: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Blood Bank" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    html: htmlString,
  });
};
