const res = require("express/lib/response");
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
var smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "pranayamailtester@gmail.com",
    pass: "afpmedtpxiavieso",
  },
};
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
  from: '"CTech Admin ?" <admin@creators.institute>', // sender address
  to: "", // list of receivers
  subject: "Regarding CTech Registration", // Subject line
  text: "", // plaintext body
  html: "", // html body
};

exports.send = (res, fullName, email, password, approvalStatus) => {
  mailOptions.to = email;
  switch (approvalStatus) {
    case "APPROVED":
      mailOptions.html = `<div> Hello ${fullName}, <br/><br/> Your user account has been approved. <br/>
        Please use this password : <b> ${password}</b> for using your application, which can be downloaded from this link : 
        <a href="#"> applicationLink.exe </a>. Thank you. <br/><br/> Regards, <br/>CTech
        </div>`;
      break;

    case "DISAPPROVED":
      mailOptions.html = `<div> Hello ${fullName}, <br/> Your user account has been terminated. To know more, please contact adminstrator.
        </div>`;
      break;

    default:
      break;
  }
  mailOptions.html =
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).send({ message: error });
      }
      console.log("Message sent: " + info.response);
    });
};
