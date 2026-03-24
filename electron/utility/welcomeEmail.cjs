const nodemailer = require("nodemailer");
const { haveEmailKeys } = require("./haveEmailKeys.cjs");

async function welcomeEmail(data, lan) {
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

  const mailOptionsEn = {
    from: '"Fide POS Support" <typira.oficial@gmail.com>',
    to: data.email,
    subject: "Welcome - Fide POS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center;">
          <img width="200px" src="https://i.imgur.com/GG61JLo.png" alt="LogoFidePOS"/>
        </div>
        <p>Hi,</p>
        <p>Welcome to Fide POS! You have successfully created your account to manage your business. This tool is completely free for you; we hope you enjoy it:</p>
        <div style="background-color: #FFEFDE; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">${data.name + " " + data.last_name}</span>
        </div>
        <p style="color: #666; font-size: 14px;">If you need any help, please don't hesitate to contact us.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request to join, please ignore this message.</p>
      </div>
    `,
  };

  const mailOptionsEs = {
    from: '"Fide POS Soporte" <typira.oficial@gmail.com>',
    to: data.email,
    subject: "Bienvenid@ - Fide POS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center;">
          <img width="200px" src="https://i.imgur.com/GG61JLo.png" alt="LogoFidePOS"/>
        </div>
        <p>Hola,</p>
        <p>¡Bienvenido a Fide POS! Has creado exitosamente tu cuenta para gestionar tu negocio. Esta herramienta es totalmente gratuita para ti; esperamos que la disfrutes:</p>
        <div style="background-color: #FFEFDE; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">${data.name + " " + data.last_name}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Si necesitas ayuda, no dudes en contactarnos.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">Si no solicitaste unirte, ignora este mensaje.</p>
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

    // El console.log debe estar fuera del if para que funcione con ambos idiomas
    if (info) console.log("📩 Email send: " + info.response);

    return { success: true };
  } catch (error) {
    console.error("❌ Error send to email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { welcomeEmail };
