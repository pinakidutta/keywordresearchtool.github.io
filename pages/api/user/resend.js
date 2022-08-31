import { connectToDatabase } from "../../../lib/mongodb"
const nodemailer = require('nodemailer');


// function that takes an email, and send a verification email to the user using nodemailer and sendinblue
export async function sendVerificationEmail(email,req){
    let db = await connectToDatabase()
    let user = await db.db.collection('users').findOne({email:email})
    if(user){
        let transporter = nodemailer.createTransport({
            service: 'sendgrid',
            auth: {
              user: process.env.SMTP_LOGIN,
                pass: process.env.SMTP_PASSWORD
            }
            });
            let mailOptions = {
                from: process.env.SMTP_EMAIL ,
                to: email,
                title: 'Verify your email',
                subject: 'Verify your email',
                // set up template with verification link + verification code
                text: 'Hello,\n\n' +
                'Thank you for signin up! please click in the link to verify your email:\n\n'+
                 process.env.NEXT_PUBLIC_PROD_URL + '\/verify\/' + user.verificationToken + '\n'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            }
        );

}

}


export default async function handler(req,res){


    if (req.method !== 'POST') { 

        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }

    // get email from request
    let email = req.body.email;

    // send verification email
   await  sendVerificationEmail(email,req)

    // return response
    res.status(200).json({
        message: 'Verification email sent'
    })

    


    
}