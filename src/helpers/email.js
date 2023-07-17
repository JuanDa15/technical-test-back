const express = require('express');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.ethereal.email",
  auth: {
    user: 'florian.muller@ethereal.email',
    pass: 'Y1hG2rU1ZXWBkug3PM'
  },
  secure: false
});


const sendEmail = (email, reservationId) => {
  const mailOptions = {
    from: 'florian.muller@ethereal.email',
    to: [...email, 'jdoo1115@gmail.com'],
    subject: `Confirmación de reserva ${reservationId}`,
    html: `
      <div>
        <h1>Confirmación de reserva ${reservationId}</h1>

        <p>Para ver más detalles de tu reserva, por favor, visita la página de la aplicación</p>
        <p>o da clic en el siguiente enlace: <a href="${process.env.CLIENT_URL}/reservation/detail/${reservationId}">Ver reserva</a></p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendEmail