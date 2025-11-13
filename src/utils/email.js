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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Blogify - OTP Verification</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body style="margin:0; padding:25px; background:#f0f2f5; font-family:'Inter', sans-serif;">

  <div style="
      max-width:500px; 
      margin:auto; 
      background:#fff; 
      border-radius:12px;
      box-shadow:0 4px 20px rgba(0,0,0,0.10);
      overflow:hidden;
    ">

    <!-- HEADER -->
    <div style="
        background:linear-gradient(90deg, #42424a, #1a73e8); 
        color:#fff; 
        text-align:center; 
        padding:30px 20px;
      ">
      <h2 style="margin:0; font-size:24px; font-weight:700;">
        Verify Your Account
      </h2>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
        Secure OTP Authentication
      </p>
    </div>

    <!-- CONTENT -->
    <div style="padding:30px 25px; color:#333;">

      <p style="font-size:14px; line-height:1.7; margin:0;">
        Hi,
      </p>

      <p style="font-size:14px; line-height:1.7; margin-top:12px;">
        You requested to reset your Blogify account password.  
        Please use the following One-Time Password (OTP) to verify your identity.
      </p>

      <!-- OTP BOX -->
      <div style="
          background:#f0f0f0;
          border-left:4px solid #1a73e8;
          padding:15px 20px;
          margin:20px 0;
          font-size:26px;
          text-align:center;
          font-weight:700;
          letter-spacing:6px;
          color:#1a73e8;
          border-radius:8px;
        ">
        ${OTP}
      </div>

      <p style="font-size:14px; color:#444; line-height:1.7;">
        This OTP is valid for <strong>2 minutes</strong> and can only be used once.  
        Please do not share this code with anyone for security reasons.
      </p>

      <p style="font-size:14px; color:#444; line-height:1.7; margin-top:15px;">
        If you did not request a password reset, please ignore this email.
      </p>

    </div>

    <!-- FOOTER -->
    <div style="
        text-align:center; 
        padding:20px; 
        background:#fafafa; 
        border-top:1px solid #eee;
        font-size:12px; 
        color:#777;
      ">
      © ${new Date().getFullYear()} Blogify — All Rights Reserved.
    </div>

  </div>

</body>
</html>


`

    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;