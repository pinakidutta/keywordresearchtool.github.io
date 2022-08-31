
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";


export default async function handler(req,res){

    if(req.method !== "POST"){
        return res.status(405).send("Method not allowed");
    }
       // if its a post request
    // get the user id from the session
    const session = await getSession({ req });
    // if no session return error
    if (!session) {
        return res.status(401).send('Unauthorized');
    }
    // if session
    // get the user id from the session
    const userId = session.token.uid;
    // get the type from the request
    let type = req.body.type;

    // we check if the user is admin
    // if not return error
    const db = await connectToDatabase();
    const user = await db.db.collection('users').findOne({ _id: ObjectId(userId)  });
    if (!user) {
        return res.status(400).send('User not found');
    }
    if(user.role !== "admin") {
        return res.status(401).send('Unauthorized');
    }

    // check if 'inits' collection exists if not we create collection named inits

    const inits = await db.db.listCollections({ name: "inits" }).toArray();
    if (inits.length === 0) {

        await db.db.createCollection("inits");
        // we create a new init with the default values
        await db.db.collection("inits").insertOne({
            _id: ObjectId(userId),
            'websiteTitle':'',
            'createdAt': new Date(),
    }
    );
    }

    // we get the init from the database
    const init = await db.db.collection('inits').findOne({ _id: ObjectId(userId)  });

    // return
    return res.status(200).send(init);
    
}