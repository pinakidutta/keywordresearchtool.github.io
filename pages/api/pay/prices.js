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


     // get uid from session token
     const uid = session.token.uid;

     const db = await connectToDatabase();

  try {
    const priceDoc = await db.db.collection('inits').findOne({}, { projection: { _id: 0, propricehalfyear: 1, proprice: 1, propriceyear: 1 } });

    /// return 200 pricedoc
       return res.status(200).json(priceDoc);

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
      
  }





}
