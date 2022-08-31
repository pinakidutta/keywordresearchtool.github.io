import { connectToDatabase } from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {


    // check if its a post request
    if (req.method !== "POST") {
        res.status(405).json({
            message: "Method not allowed"
        });
        return;
    }

    // check if session exists
    let session = await getSession({ req });
    if (!session) {
        res.status(401).json({
            message: "You are not logged in"
        });
        return;
    }

    try {
         // get uid from session
    let uid = session.token.uid;
    // get keyword from request body
    let historyId = req.body.historyId;



    // find the user and get specific history by keyword name
    let db = await connectToDatabase();
    let user = await db.db.collection("users").findOne({ _id:ObjectId(uid) });
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    //  search for history item in history collection using object id(historyID)
    let historyItem = await db.db.collection("history").findOne({ _id: ObjectId(historyId) });
    if (!historyItem) {
        res.status(404).json({
            message: "History item not found"
        });
        return;
    }


    return res.status(200).json({
        history:historyItem
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

   
}
