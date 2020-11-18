const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kadkredit20@gmail.com',
    pass: '(0)kk(0)',
  },
});

module.exports = transporter;
