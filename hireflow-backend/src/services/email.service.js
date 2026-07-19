const nodemailer = require("nodemailer");

const isEmailConfigured = () =>
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_USER !== "your_email@gmail.com"; // guard against untouched .env.example placeholder

const transporter = isEmailConfigured()
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    // Dev mode without email configured: don't block the calling flow (e.g. registration).
    // Log so the developer can still see/copy links while testing.
    console.warn(`[email] Skipped sending "${subject}" to ${to} — EMAIL_USER/EMAIL_PASS not configured.`);
    return { skipped: true };
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
  return { skipped: false };
};

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const result = await sendEmail({
    to: email,
    subject: "Verify your HireFlow account",
    html: `
      <h2>Welcome to HireFlow 🚀</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
  if (result.skipped) {
    console.log(`[email] Verification link for ${email}: ${verifyUrl}`);
  }
  return result;
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const result = await sendEmail({
    to: email,
    subject: "Reset your HireFlow password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password. If you didn't request this, ignore this email.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
  if (result.skipped) {
    console.log(`[email] Password reset link for ${email}: ${resetUrl}`);
  }
  return result;
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
