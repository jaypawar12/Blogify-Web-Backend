const nodemailer = require('nodemailer');

const sendMail = async (to, OTP) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    let mailOptions = {
        from: process.env.USER_EMAIL,
        to: to,
        subject: 'Forgot Password',
        html: `
<div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:25px;">
  <div style="max-width:480px; margin:auto; background:white; padding:25px; border-radius:10px;
      box-shadow:0 4px 10px rgba(0,0,0,0.08);">

    <h2 style="color:#333; text-align:center; margin-bottom:5px;">
        🔐 Forgot Your Password?
    </h2>

    <p style="color:#555; text-align:center; font-size:14px; margin-top:0;">
        hey, we received a request to reset your account password.
    </p>

    <div style="margin:25px 0; text-align:center;">
        <p style="font-size:15px; color:#555; margin-bottom:8px;">Your OTP Code is</p>

        <div style="
            display:inline-block;
            padding:12px 25px;
            background:#4f46e5;
            color:white;
            font-size:28px;
            letter-spacing:5px;
            font-weight:bold;
            border-radius:8px;
        ">
            ${OTP}
        </div>
    </div>

    <p style="font-size:13px; color:#666; line-height:1.5;">
      This OTP will expire in <b>2 minutes</b>, so pls use it asap. 
      If you didn’t ask for password reset, just ignore this mail (maybe someone mis-typed).
    </p>

    <hr style="border:none; height:1px; background:#eee; margin:25px 0;" />

    <p style="font-size:12px; text-align:center; color:#999;">
      © ${new Date().getFullYear()} Total Coding Academy — All Rights Reserved.
    </p>

  </div>
</div>
`

    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;