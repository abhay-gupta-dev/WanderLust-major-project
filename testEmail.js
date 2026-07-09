require('dotenv').config();
const { sendEmail } = require('./utils/sendEmail');

sendEmail(
    'guptaabhay37075@gmail.com',   // ← use this exact address
    'Test Email',
    '<h2>This is a test</h2><p>If you got this, Resend is working!</p>'
).then(() => console.log('Done — check console above for errors, and check your inbox.'));