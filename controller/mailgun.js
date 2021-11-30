const MailGen = require('mailgen');
const mailgun = require("mailgun-js");
const DOMAIN = "mail.viavix.com";
const mg = mailgun({apiKey: "as", domain: DOMAIN});
require('dotenv').config();

const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: 'Viavix App',
    link: 'http://localhost:4000',
    copyright: 'Copyright © 2021 Viavix. All rights reserved.',
  }
});
const sendMail = (username, recipient, code) => {
  try {
    const email = {
      body: {
        greeting: 'Dear',
        // signature: ['Best Regards','\nViavix Support Team'],
        name: username,
        intro: ['Welcome to email verification!', 'To complete SignUp at Viavix, please enter this code:',code],
        // outro: ['Need help, or have questions?', 'Just reply to this email, we\'d love to help.'],
        // action: {
        //   instructions: 'You can verify your account to click the button below',
        //   button: {
        //     color: '#33b5e5',
        //     text: 'Verify account',
        //     link: 'http://localhost:4000/verify_account'
        //   }
        // }
      }
    };
    const emailTemplate = mailGenerator.generate(email);
    require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');
    const data =  {
        from: "Viavix <info@viavix.com>",
        to: recipient,
        subject: 'SignUp at Viavix',
        html: emailTemplate,
    };
    mg.messages().send(data, function (error, body) {
        if (error) {
            return;
        }
        else {
            return body.id;
        }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = sendMail;
