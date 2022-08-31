import { connectToDatabase } from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

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

  // we get the first document in init collection
  // projection paypalClientKey
    const db = await connectToDatabase();
    try {
        const initDoc = await db.db.collection('inits').findOne({}, { projection: { _id: 0, paypalkey: 1 } });

        // return 
        return res.status(200).json(initDoc);
    
    } catch (error) {
    
        console.error(error);
        return res.status(500).send("Server error");
    }

}