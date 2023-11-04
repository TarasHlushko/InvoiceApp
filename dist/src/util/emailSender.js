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
export default async function sendEmail(emailReceiver, subject, textBody) {
    const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: emailReceiver,
        subject: subject,
        text: textBody, // plain text body
    });
}
