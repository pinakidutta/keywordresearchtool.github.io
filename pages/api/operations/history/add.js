import { connectToDatabase } from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {


    // check if its a post reuqest
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

    // get uid from session
    let uid = session.token.uid;

    let searchedKeyword = req.body.keyword;
    let searchedResult = req.body.result;
    let volume = req.body.volume
    let cpc = req.body.cpc

    let db = await connectToDatabase();

    // check if the user exists

    let user = await db.db.collection("users").findOne({ _id: ObjectId(uid) });
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    // check if user have history collection  exists if not create it 

    if (!user.history) {
        await db.db.collection("users").updateOne({ _id: ObjectId(uid) }, { $set: { history: [] } });
    }




    // add one document to  history collection


    try {
      let historyItem =    await db.db.collection("history").insertOne({
            keyword: searchedKeyword,
            result: searchedResult,
            created_at: new Date(),
            difficulty:req.body.difficulty,
            user: ObjectId(uid),
            country : req.body.country,
            cpc:cpc,
            volume : volume
            
        });

        // add history item id to user history collection
        await db.db.collection("users").updateOne({ _id: ObjectId(uid) }, { $push: { history: historyItem.insertedId } });


    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;

    }


    res.status(200).json({
        message: "Keyword added to history"
    });





    }