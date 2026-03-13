const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CreditWise <noreply@creditwise.com>',
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to', options.email);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw the error back to the route so the user registration still succeeds
    // even if the email service fails (e.g., if env vars aren't set yet)
  }
};

module.exports = sendEmail;
