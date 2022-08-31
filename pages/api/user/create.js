import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

let nodemailer = require('nodemailer');

// get  smtp_server from env file

// function that takes an email, and send a verification email to the user using nodemailer and sendinblue
export async function sendVerificationEmail(email, req) {
  let db = await connectToDatabase();
  let user = await db.db.collection('users').findOne({ email: email });
  if (user) {
    let transporter = nodemailer.createTransport({
      service: 'sendgrid',
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Verify your email',
      text:
        'Hello,\n\n' +
        'Please verify your email by clicking the link: \nhttp://' +
        req.headers.host +
        '/verify/' +
        user.verificationToken +
        '\n',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    });
    return;
  }

  let db = await connectToDatabase();

  // get email and password from request
  let email = req.body.email;
  let password = req.body.password;

  // check if the user not exist
  // if not create one with the encryption of bycript
  let user = await db.db.collection('users').findOne({ email });
  if (!user) {
    let emailVerification = 'off';
    // we check if email verifiaction is off or on

    const inits = await db.db
      .collection('inits')
      .findOne({}, { projection: { emailVerification: 1 } });
    if (inits.emailVerification === 'on') {
      emailVerification = 'on';
    }

    // hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await db.db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'member',
      membership: 'Basic',
      createdAt: new Date(),
      usage: {
        keywordSearches: 0,
        onpageSearches: 0,
        keywordsReturned: 0,
        favourites:0,
        totalCompSearches:0
      },
      status: 'active',
      verified: emailVerification === 'on' ? false : true,
      ipHistory: [],
      verificationToken:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      verificationCode: Math.floor(1000 + Math.random() * 9000),
      favourites: [],
      history: [],
      notifications:[],
      firstname: '',
      lastname: '',
      username: '',
      emailNotification: 'on',
      inAppNotification: 'on',
      cookies: 'on',
      subscriptionEnd: null,
    });

    // get the user
    user = await db.db.collection('users').findOne({ email });

    // use smtp to send an email with verification link
    await sendVerificationEmail(email, req);
    //  we increment one to inits totalUsers
    await db.db.collection('inits').updateOne({}, { $inc: { totalUsers: 1 } });
  } else {
    // return that the use already exists
    return res.status(400).json({
      status: 'error',
      message: 'User already exists',
    });
  }
  

  // return the user
  res.status(200).json(user);
}
