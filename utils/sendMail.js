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
            text: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login Information</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            
                h1 {
                  color: #333;
                }
            
                p {
                  margin-bottom: 20px;
                }
            
                .credentials {
                  font-weight: bold;
                  background-color: #eee;
                  padding: 10px;
                  border-radius: 5px;
                  margin-bottom: 20px;
                }
            
                .link {
                  color: #007bff;
                  text-decoration: none;
                }
              </style>
            </head>
            
            <body>
              <div class="container">
                <h1>Login Information</h1>
                <p>Login to your account on <a class="link" href="https://ims-client.vercel.app/">https://ims-client.vercel.app/</a></p>
                
                <div class="credentials">
                  <p><strong>Credentials:</strong></p>
                  <p>Email: ${email}</p>
                  <p>Password: ${password}</p>
                </div>
            
                <p>If you have any questions, please contact support.</p>
              </div>
            </body>
            
            </html>
            `
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