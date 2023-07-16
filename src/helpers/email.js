const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.office365.com",
  auth: {
    user: 'jdoo1115@outlook.es', // Your email address
    pass: 'lol24pcAngular ', // Your email password or app-specific password for Gmail
  },
  secure: false
});

// TODO: CHANGE TEMPLATE EMAIL
const sendEmail = () => {
  const mailOptions = {
    from: 'jdoo1115@outlook.es',
    to: 'jdoo1115@gmail.com',
    subject: 'Hello from Express',
    text: 'This is a test email sent from Express using Nodemailer.',
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendEmail