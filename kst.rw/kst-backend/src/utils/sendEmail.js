const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    // Ensure you have these variables in your .env file
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'KST Support'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional: for HTML emails
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
