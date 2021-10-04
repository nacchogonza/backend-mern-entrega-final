import nodemailer from "nodemailer";
import config from "../../config.js";

const transporterGmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL_NODEMAILER_USER,
    pass: config.GMAIL_NODEMAILER_PASS,
  },
});

const sendGmailEmail = (mailOptions) => {
  transporterGmail.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log.log("Error en el envio de Aviso de Registro", err);
      return err;
    }
    console.log("Mail de Aviso de Registro enviado correctamente", info);
  });
};

export { sendGmailEmail };