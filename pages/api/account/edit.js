
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const bcrypt = require("bcryptjs");


export default async function handler(req, res) {
   // check if its a post request
   // if not return error
    if(req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }
    // if its a post request
    // get the user id from the session
    const session = await getSession({ req });
    // if no session return error
    if (!session) {
        return res.status(401).send('Unauthorized');
    }
    // if session
    // get the user id from the session
    const userId = session.token.uid;
    // get the type from the request
    const type = req.body.type;

    // we check if the user exists
    // if not return error
    const db = await connectToDatabase();
    const user = await db.db.collection('users').findOne({ _id: ObjectId(userId)  });
    if (!user) {
        return res.status(400).send('User not found');
    }

    // we check which type of user we are updating : account,password,notification,privacy

    switch (type) {
        case "Account":
              // we get firstname,lastname,username from the request and we set them to the user in the database
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const username = req.body.username;
            await db.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { firstname, lastname, username } });
            return res.status(200).send('Account updated');

            // close db connection
            
            
        case "Password":
            // we get the password from the request and we set it to the user in the database
            const password = req.body.password;
            const currentPassword = req.body.currentPassword;
            // we verify if user password equals the current password
            // keep in mind the hash is not the same as the password
            let isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if(isPasswordCorrect) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { password: hashedPassword } });
            return res.status(200).send('Password updated');
        } else {
           
            /// return json with error
            return res.status(400).send('Current password is incorrect');
        }

        case "Notification":
            // get the notification bool from the request and we set it to the user in the database
            const emailNotification = req.body.emailNotification;
            const inAppNotification = req.body.inAppNotification;

            await db.db.collection('users').updateOne({  _id: ObjectId(userId) }, { $set: { inAppNotification,emailNotification } });
            return res.status(200).send('Notification updated');
            
            case "Privacy":
            // get cookies bool of the user and we set it to the user in the database
            const cookies = req.body.privacy;
            await db.db.collection('users').updateOne({  _id: ObjectId(userId) }, { $set: { cookies } });
            return res.status(200).send('Privacy updated');
        default:
            return res.status(400).send('Bad request');

}

 

}