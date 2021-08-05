import nodemailer from "nodemailer";
import clientTwilio from "twilio";

const etherealHost = "smtp.ethereal.email";
const etherealPort = 587;
const etherealUser = "telly89@ethereal.email";
const etherealPass = "qBA3arDFWw9Z2nTBnQ";

const transporterEthereal = nodemailer.createTransport({
  host: etherealHost,
  port: etherealPort,
  auth: {
    user: etherealUser,
    pass: etherealPass,
  },
});

const gmailUser = "nachomgonzalez93@gmail.com";
const gmailPass = "ouikpvfrztcmqqhy";

const transporterGmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

const sendEtherealEmail = (mailOptions) => {
  transporterEthereal.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.log("error", err);
      return err;
    }
    logger.log("info", info);
  });
};

const sendGmailEmail = (mailOptions) => {
  transporterGmail.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.log("error", err);
      return err;
    }
    logger.log("info", info);
  });
};

/* TWILIO CONFIG & UTILS */
const getWordPosition = (palabra, frase) => {
  const position = frase.indexOf(palabra);
  return position;
};

const accountSid = "AC6a36f7316fe7338f08d867dcdc94b264";
const accountToken = "351c5ff7d7bada406d5b4a2fb9f014ad";

const twilioFrom = "+12027336319";
const twilioTo = "+5492945404287";

const twilioSender = clientTwilio(accountSid, accountToken);

const sendSms = async (data) => {
  try {
    const msg = await twilioSender.messages.create({
      body: `Mensaje enviado por ${data.nombre}. Texto: ${data.text}`,
      from: twilioFrom,
      to: twilioTo,
    });

    console.log(msg.sid);
  } catch (error) {
    console.log(error);
  }
};
/* TWILIO CONFIG */

export { sendEtherealEmail, sendGmailEmail, sendSms };
