const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.office365.com",
  auth: {
    user: 'jdoo1115@outlook.es', 
    pass: process.env.EMAIL_PASS,
  },
  secure: false
});


const sendEmail = (email, reservationId) => {
  const mailOptions = {
    from: 'jdoo1115@outlook.es',
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