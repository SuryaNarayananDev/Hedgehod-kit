const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const link = `${process.env.BASE_URL}/auth/verify-email?token=${token}`
;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
  });
};

const sendResetOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <b>${otp}</b>. It expires in ${process.env.RESET_OTP_EXPIRY}.</p>`
  });
};

module.exports = { sendVerificationEmail, sendResetOTPEmail };
