import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {

    // check if request is a post
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    // we connect to database
    let db = await connectToDatabase();

    let init = await db.db.collection('inits').findOne({})

    // return 
    res.status(200).json({
        subscriptionsToggle: init.subscriptionsToggle,
    });
    
}