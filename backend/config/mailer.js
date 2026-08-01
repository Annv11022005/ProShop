import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;

(async () => {
  try {
    await transporter.verify();
    console.log('Server is ready to take our messages');
  } catch (err) {
    console.error('Verification failed:', err);
  }
})();
