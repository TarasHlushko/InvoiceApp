import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  //   maxConnections: 1,
  //   pool: true,
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

export default async function sendEmail(
  emailReceiver: string,
  subject: string,
  textBody: string
) {
  const info = await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // sender address
    to: emailReceiver, // list of receivers
    subject: subject, // Subject line
    text: textBody, // plain text body
  });
}
