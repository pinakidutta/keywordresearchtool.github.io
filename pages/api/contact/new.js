import {connectToDatabase} from '../../../lib/mongodb'


export default async function handler(req, res) {

    // check if request is a post
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }



    // get user from database
    // projection membership, subscriptionEnds
    
    const db = await connectToDatabase();

    let email = req.body.email;
    let message = req.body.message;

    // add new document to messages collection

    const result = await db.db.collection("messages").insertOne({
        email: email,
        message: message,
        read:false,
        createdAt: new Date()
    });

        //  we increment one to inits totalUsers
        await db.db.collection('inits').updateOne({}, { $inc: { messages: 1 } });

    // return 
    res.status(200).json({
        message: "Message sent"
    });
    
}