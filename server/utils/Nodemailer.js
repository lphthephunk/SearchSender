import nodemailer from "nodemailer";
import NodeMailerCreds from "../NodeMailerCreds";

const FROM_ACCOUNT = { user: NodeMailerCreds.user, pass: NodeMailerCreds.pass };

export const sendMessage = async (
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
      fromAccount = FROM_ACCOUNT;
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

export const formulateCraigslistResponse = ({ data }) => {};
