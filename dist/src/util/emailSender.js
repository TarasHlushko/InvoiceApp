import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    //   maxConnections: 1, //<-----------ADD THIS LINE
    //   pool: true, //<-----------ADD THIS LINE
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'scsheva@outlook.com',
        pass: 'Taras225',
    },
});
// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail(emailReceiver, subject, textBody) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'scsheva@outlook.com',
        to: emailReceiver,
        subject: subject,
        text: textBody, // plain text body
    });
}
