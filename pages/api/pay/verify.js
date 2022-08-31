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

    if(req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const session = await getSession({ req });
    if(!session) {
        return res.status(401).send("Unauthorized");
    }
    
    const uid = session.token.uid;

     let paymentKey = await req.body.purchaseId

     /// connect to database
        const db = await connectToDatabase();
    // we look for paymentKey in PaymentsIntent collection
    const payment = await db.db.collection("PaymentsIntent").findOne({key: paymentKey});

    // if paymentKey is not found we return error
    if(!payment) {
        return res.status(400).send("Payment key not found");
    }

    if(payment.uid !== uid) {
        return res.status(401).send("Unauthorized");
    }
    
    /// here  the checks are done we can now add subscription to user 
    let daysToAdd = 0;
    // days to add 
    if(payment.duration === "1 Month") {
        daysToAdd = 30;
    } else if(payment.duration === "6 Months") {
        daysToAdd = 180;
    } else if(payment.duration === "1 Year") {
        daysToAdd = 365;
    }

    // we find the user and update membership to pro

    await db.db.collection("users").updateOne({_id: ObjectId(uid)}, {$set: {membership: "Pro",subscriptionEnds: addDays(daysToAdd)}});
    await db.db.collection('inits').updateOne({}, { $inc: { totalSubscriptions: 1 } });


    await db.db.collection("subscriptions").insertOne({uid: uid, start: new Date() ,plan:payment.plan, duration: payment.duration,method:payment.method, email:payment.email, paymentKey: paymentKey, ends: addDays(daysToAdd)});

    // remove paymentKey from PaymentsIntent collection
    await db.db.collection("PaymentsIntent").deleteOne({key: paymentKey});

    /// return 200
    return res.status(200).send("Success");


}
