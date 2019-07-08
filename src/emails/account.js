
const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: "kyle.hoell@gmail.com",
        subject: "Thanks for joining!",
        text: `Welcome to the app ${name}, let me know how you get along with the app`
    })
}

const sendCancelationEmail = (email, name) => {

    sgMail.send({
        to: email, 
        from: "kyle.hoell@gmail.com", 
        subject: "Why did you leave us?",
        text: `Hello ${name}, we were wondering why you decided to cancel your account. `
    })
}

module.exports = {sendWelcomeEmail, sendCancelationEmail};