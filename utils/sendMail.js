const nodemailer = require('nodemailer');

function sendMail(email, password) {
    return new Promise((resolve, reject) => {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // e.g., 'Gmail'
            auth: {
                user: 'authenticationappp@gmail.com',
                pass: 'xfutqblbqpxyucnn'
            }
        });

        // Set up the email data
        const mailOptions = {
            from: 'authenticationappp@gmail.com',
            to: email,
            subject: 'PINCODE',
            text: `Login to your account on https://ims-client.vercel.app/ \n\nCredentials:\n\nEmail: ${email}\nPassword: ${password}\n`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject('Error Occured while sending mail');
            } else {
                console.log('Email sent:', info);
                resolve('Email sent successfully');
            }
        });
    });
}


module.exports = sendMail;