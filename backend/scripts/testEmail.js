require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send = async () => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Confirm registration on Éternité',
      html: `
<div style="max-width: 400px; margin: 0 auto; background: #FFFDF9; padding: 40px 32px;">
  <div style="font-family: Ethic New; text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 24px; margin-bottom: 32px;">
    <span style="font-size: 32px; color: #221F1D;">Éternité</span>
  </div>

  <p style="font-family: Termina Test, sans-serif; font-size: 16px; color: #221F1D; margin-bottom: 0px;">Dear, user!</p>
  <p style="font-family: Termina Test, sans-serif; font-size: 12px; color: #221F1D; line-height: 1.6; margin-bottom: 32px;">
    To confirm registration — press a button below
  </p>
  <div style="text-align: center; margin-bottom: 40px;">
    <a href="http://localhost:5000/api/users/verify/test123" style="
      display: inline-block;
      background: #221F1D;
      color: #FFFDF9;
      text-decoration: none;
      padding: 12px 24px;
      font-family: Termina Test, sans-serif;
      font-size: 12px;
    ">Confirm</a>
  </div>

  <div style="border-top: 1px solid #e0e0e0; padding-top: 20px;">
    <p style=" font-family: Termina Test, sans-serif; font-size: 12px; color: #aaaaaa; margin: 0;">
      If you did not register — please ignore this email.
    </p>
  </div>

</div>
`,
    });
    console.log('Tle letter has been sent:', result.messageId);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

send();