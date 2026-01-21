const nodemailer = require("nodemailer");
require("dotenv").config();
const AUTH_CODES = require("../../constants/authCodes.json");

// Configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendRecoveryEmail(to, tempPassword, lan) {
  const mailOptionsEn = {
    from: '"Fide POS Support" <typira.oficial@gmail.com>',
    to: to,
    subject: "Password Recovery - Fide POS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center;">
          <img width="200px" src="https://i.imgur.com/GG61JLo.png" alt="LogoFidePOS"/>
        </div>
        <p>Hi,</p>
        <p>You have requested to recover your password to access the system. This is your temporary password:</p>
        <div style="background-color: #FFEFDE; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">${tempPassword}</span>
        </div>
        <p style="color: #666; font-size: 14px;">For security reasons, we recommend changing this password once you log in.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this change, please contact the administrator.</p>
      </div>
    `,
  };

  const mailOptionsEs = {
    from: '"Fide POS Soporte" <typira.oficial@gmail.com>',
    to: to,
    subject: "Recuperación de Contraseña - Fide POS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center;">
          <img width="200px" src="https://i.imgur.com/GG61JLo.png" alt="LogoFidePOS"/>
        </div>
        <p>Hola,</p>
        <p>Has solicitado recuperar tu contraseña para poder acceder al sistema. La siguiente contraseña es temporal:</p>
        <div style="background-color: #FFEFDE; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">${tempPassword}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Por seguridad, te recomendamos cambiar esta contraseña una vez que logres iniciar sesión.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">Si no solicitaste este cambio, por favor contacta al administrador.</p>
      </div>
    `,
  };

  try {
    let info;
    if (lan === "en") {
      info = await transporter.sendMail(mailOptionsEn);
    } else if (lan === "es") {
      info = await transporter.sendMail(mailOptionsEs);
    }
    console.log("Email send: " + info.response);
    return { success: true, result: AUTH_CODES.EMAIL_SENT };
  } catch (error) {
    console.error("Error send to email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendRecoveryEmail };
