import nodemailer from "nodemailer";

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
      fromAccount = {
        user: process.env.SenderEmail,
        pass: process.env.SenderPassword
      };
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: fromAccount.user,
        pass: fromAccount.pass
      }
    });

    console.log(transporter);

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
