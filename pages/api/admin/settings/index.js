
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

import { IncomingForm } from 'formidable'




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
    let type = req.body.type;

    // we check if the user is admin
    // if not return error
    const db = await connectToDatabase();
    const user = await db.db.collection('users').findOne({ _id: ObjectId(userId)  });
    if (!user) {
        return res.status(400).send('User not found');
    }
    if(user.role !== "admin") {
        return res.status(401).send('Unauthorized');
    }


 
    // check if 'inits' collection exists if not we create collection named inits
    const inits = await db.db.listCollections({ name: "inits" }).toArray();
    if (inits.length === 0) {
        await db.db.createCollection("inits");
        // we create a new init with the default values
        await db.db.collection("inits").insertOne({
            _id: ObjectId(userId),
            'websiteTitle':'',
            'createdAt': new Date(),
    }
    );
    }

    

   
    // we check which type of user we are updating : account,password,notification,privacy

    switch (type) {
        case "Meta":
              // we get websiteTitle,websiteDescription,websiteKeywords from the request and we set them to the inits first documnet in the database
            const websiteTitle = req.body.websiteTitle;
            const websiteDescription = req.body.websiteDescription;
            const websiteKeywords = req.body.websiteKeywords;
        
       
            // we update the first document in inits collection
            await db.db.collection('inits').updateOne({ _id: ObjectId(userId) }, { $set: { websiteTitle, websiteDescription, websiteKeywords } });
            return res.status(200).send('Meta updated');

            break;
            
        case "General":

             // we get websiteName,emailVerification
             
            const websiteName = req.body.websiteName;
            const emailVerification = req.body.emailVerification;

             // we update the first document in inits collection
             await db.db.collection('inits').updateOne({ _id: ObjectId(userId) }, { $set: { websiteName, emailVerification } });
             return res.status(200).send('General updated');

            break;
           

        case "Subscriptions":
            // get subscriptions, proprice, paypalkey, stripeclientkey, paymentMethod, from request
            const subscriptions = req.body.subscriptions;
            const proprice = req.body.proprice;
            const paypalkey = req.body.paypalkey;
            const stripeclientkey = req.body.stripeclientkey;
            const paymentMethod = req.body.paymentMethod;
            const propricehalfyear = req.body.propricehalfyear;
            const propriceyear = req.body.propriceyear;
            const basicUsageLimit = req.body.basicUsageLimit;
            const basicCompLimit = req.body.basicCompLimit;

            
            // we update the first document in inits collection
            await db.db.collection('inits').updateOne({ _id: ObjectId(userId) }, { $set: { subscriptionsToggle:subscriptions === 'on' ? true : false, proprice, paypalkey, stripeclientkey, paymentMethod , propricehalfyear,propriceyear,basicUsageLimit,basicCompLimit} });
            // we set subscriptions in inits collection document to the subscriptions value
            await db.db.collection('inits').updateOne({}, { $set: { subscriptions } });
            return res.status(200).send('Subscriptions updated');
       
            case "Privacy":oo
            // get cookies bool of the user and we set it to the user in the database
            const cookies = req.body.privacy;
            await db.db.collection('users').updateOne({  _id: ObjectId(userId) }, { $set: { cookies } });
            return res.status(200).send('Privacy updated');
        default:
            return res.status(400).send('Bad request');

}

 

}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
};
