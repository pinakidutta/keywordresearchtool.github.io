import { connectToDatabase } from "../../../lib/mongodb";
import { getSession } from "next-auth/react";


export default async function handler(req, res) {

    // check if request is a post
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    // get session
    const session = await getSession({ req });
    if(!session) {
        return res.status(401).send("Unauthorized");
    }

    // get uid from session token
    const uid = session.token.uid;

    // get user from database
    // projection membership, subscriptionEnds
    
    const db = await connectToDatabase();
    // get the first documents in inits collection, projection : ls
    const init = await db.db.collection("inits").findOne({}, { projection: { lic: 1 } });
    console.log('license')
    console.log(init)

    // return

    res.status(200).json({
        ls: init.lic
    });

    
}