import { connectToDatabase } from "../../../lib/mongodb";
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

    let resultsPerPage = 5;
    let page = req.body.page ;
    let skip = (page - 1) * resultsPerPage;

    // get users

    let users = await db.db.collection("messages").find({}).skip(skip).limit(resultsPerPage).toArray();

    // get total users
    let totalMessages = await db.db.collection("messages").countDocuments();
    // return messages
return    res.status(200).json(users)





}