const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

module.exports = class Email {
  constructor(user, message) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.message = message;
    this.from = `Ruth Cohen <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // Prod: use sendGrid
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport(
        nodemailerSendgrid({
          apiKey: process.env.SENDGRID_PASSWORD,
        })
      );
    }

    // Dev: use mailTrap
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_EMAIL_HOST,
      port: process.env.MAILTRAP_EMAIL_PORT,
      auth: {
        user: process.env.MAILTRAP_EMAIL_USERNAME,
        pass: process.env.MAILTRAP_EMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      text: this.message,
      subject,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome Email');
  }

  async sendPasswordReset() {
    await this.send('Password Reset');
  }
};
