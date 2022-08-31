import { connectToDatabase } from "../../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";


export default async function handler(req, res) {

    // check if its a post request
    // return error
    if (req.method !== "POST") {
        res.status(405).json({
            message: "Method not allowed"
        })
        return
    }
    // get session
    let session = await getSession({ req })

    // get uid from session token
    let uid = session.token.uid;

    // check if the user is admin in database
    // if not return unothorized
    let db = await connectToDatabase();
    let user = await db.db.collection("users").findOne({
        "_id": ObjectId(uid)
    });
    if (user.role !== "admin") {
        res.status(403).json({
            message: "Forbidden"
        })
        return
    }

    // get email from body
    let email = req.body.email;

    // look for a document with the email in subscriptions collection
    let subscription = await db.db.collection("subscriptions").findOne({
        "email": email
    });

    // if no document found return not found
    if (!subscription) {
        res.status(404).json({
            message: "Subscription not found"
        })
        return
    }

    // return subscription
    return res.status(200).json(subscription)
    
}