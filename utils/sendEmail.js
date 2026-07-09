const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports.sendEmail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Wanderlust <onboarding@resend.dev>', // swap for your verified domain later
            to,
            subject,
            html
        });

        if (error) {
            console.error('Resend error:', error);
        } else {
            console.log(`Email sent to ${to} — "${subject}"`);
        }
        return data;
    } catch (err) {
        console.error('Email sending failed:', err);
    }
};