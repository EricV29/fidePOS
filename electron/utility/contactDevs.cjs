const nodemailer = require("nodemailer");
require("dotenv").config();
const AUTH_CODES = require("../../constants/authCodes.json");
const { haveEmailKeys } = require("./haveEmailKeys.cjs");

async function contactDevs(data) {
  const credentials = haveEmailKeys();

  if (!credentials || !credentials.email_user || !credentials.email_pass) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: credentials.email_user,
      pass: credentials.email_pass,
    },
  });

  const mailOptions = {
    from: '"Fide POS Contact" <typira.oficial@gmail.com>',
    to: "typira.oficial@gmail.com",
    subject: "Report - Fide POS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center;">
          <img width="200px" src="https://i.imgur.com/GG61JLo.png" alt="LogoFidePOS"/>
        </div>
        <p>Hi,</p>
        <p>User ${data.name + " " + data.last_name} has reported the following:</p>
        <div style="background-color: #FFEFDE; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 15px; font-weight: bold; color: #333; letter-spacing: 2px;">${data.text}</span>
        </div>
      </div>
    `,
  };

  try {
    info = await transporter.sendMail(mailOptions);
    console.log("Email send: " + info.response);
    return { success: true, result: AUTH_CODES.EMAIL_SENT };
  } catch (error) {
    console.error("Error send to email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { contactDevs };
