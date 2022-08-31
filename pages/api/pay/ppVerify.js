import { connectToDatabase } from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";


/// function that add days to todays date
function addDays(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export default async function handler(req, res) {

    /// check if its a post request
    if(req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }
    // check if the request is from the same origin
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    /// get session
    const session = await getSession({ req });
    if(!session) {
        return res.status(401).send("Unauthorized");
    }

    /// get user id
    const uid = session.token.uid;

    

    /// connect to database
    const db = await connectToDatabase();
    // we look for paymentKey in PaymentsIntent collection

    // duration
    const d = req.body.d

    /// here  the checks are done we can now add subscription to user 

    let daysToAdd = 0;
    // days to add 
    if(d === "1 Month") {
        daysToAdd = 30;
    } else if(d === "6 Months") {
        daysToAdd = 180;
    } else if(d === "1 Year") {
        daysToAdd = 365;
    }

    // we find the user and update membership to pro

    await db.db.collection("users").updateOne({_id: ObjectId(uid)}, {$set: {membership: "Pro",subscriptionEnds: addDays(daysToAdd)}});
    await db.db.collection('inits').updateOne({}, { $inc: { totalSubscriptions: 1 } });
    await db.db.collection("subscriptions").insertOne({uid: uid, start: new Date() ,plan:'Pro', duration: d,method:'Paypal', email:session.token.email, ends: addDays(daysToAdd)});


   

    // return success
    return res.status(200).send("success");
    
}
