const nodemailer = require("nodemailer");
const NodeMailerCreds = require("../NodeMailerCreds.js");

const FROM_ACCOUNT = { user: NodeMailerCreds.user, pass: NodeMailerCreds.pass };

const sendMessage = async (
  toAccount,
  message,
  subject,
  useTestAccount = false
) => {
  try {
    let fromAccount;
    if (useTestAccount === true) {
      fromAccount = await nodemailer.createTestAccount();
    } else {
      if (process.env.NODE_ENV) {
        fromAccount = FROM_ACCOUNT;
      } else {
        fromAccount = {
          user: process.env.SenderEmail,
          password: process.env.SenderPassword
        };
      }
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: fromAccount.user,
        pass: fromAccount.pass
      }
    });

    console.log(transporter);

    console.log("to: ", toAccount);
    let mailOptions = {
      from: '"Search Sender"',
      to: toAccount,
      subject: `Your Search Results for ${subject}`,
      html: message
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: ", info.messageId);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMessage;
