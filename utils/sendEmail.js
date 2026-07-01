const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

module.exports = async function sendEmail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text
        });

        console.log("Email sent:", info.messageId);
    } catch (err) {
        console.log("Nodemailer Error:", err);
        throw err;
    }
};