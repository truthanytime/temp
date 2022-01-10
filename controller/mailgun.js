const MailGen = require('mailgen');
const mailgun = require("mailgun-js");
const DOMAIN = "mail.troo.com";
const mg = mailgun({apiKey: "a", domain: DOMAIN});
require('dotenv').config();

const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: 'troo App',
    link: 'https://viavix.com',
    copyright: 'Copyright © 2021 troo. All rights reserved.',
  }
});
const sendMail = (username, recipient, code) => {
  try {
    const email = {
      body: {
        greeting: 'Dear',
        // signature: ['Best Regards','\ntroo Support Team'],
        name: username,
        intro: ['Welcome to email verification!', 'To complete SignUp at troo, please enter this code:',code],
        // outro: ['Need help, or have questions?', 'Just reply to this email, we\'d love to help.'],
        // action: {
        //   instructions: 'You can verify your account to click the button below',
        //   button: {
        //     color: '#33b5e5',
        //     text: 'Verify account',
        //     link: 'https://viavix.com/verify_account'
        //   }
        // }
      }
    };
    const emailTemplate = mailGenerator.generate(email);
    require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');
    const data =  {
        from: "troo <info@troo.com>",
        to: recipient,
        subject: 'SignUp at troo',
        html: emailTemplate,
    };
    mg.messages().send(data, function (error, body) {
        if (error) {
          console.log('mail sending failed:', error);
            return '';
        }
        else {
          console.log('mail sending success');
            return body.id;
        }
    });
  } catch (error) {
    throw new Error(error.message);
    return '';
  }
}


module.exports = sendMail;
