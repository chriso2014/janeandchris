var nodemailer = require('nodemailer');

function sendEmail(message){
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
    user: 'chrisormerod1981@gmail.com',
    pass: 'ormerod$$1981'
   }
  });

  var mailOptions = {
    from: 'theOrmerods@wedding.com', // sender address
    to: 'chrisormerod1981@gmail.com', // list of receivers
    subject: 'Someone has R.S.V.Ped for the wedding', // Subject line
    html: '<p> '+message+'</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
  });
}

module.exports = sendEmail;
