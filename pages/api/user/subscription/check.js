import { connectToDatabase } from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req,res){

    // check if it is a post request if not return status 405
    // then check if the user is logged in if not return status 401
    // then get the user from database useing ObjectId(uid)
    // if user subscription is Pro we check if the subscriptionEnds is less than today
    // if yes we set the user subscriptuion to Basic and subscriptionEnds to null
    // if not we return status 200

    if(req.method !== "POST"){
        return res.status(405).send("Method not allowed");
    }

    const session = await getSession({req});
    if(!session){
        return res.status(401).send("Unauthorized");
    }

    const uid = session.token.uid;

        // then get the user from database useing ObjectId(uid)
    const db = await connectToDatabase();
    const user = await db.db.collection("users").findOne({_id: ObjectId(uid)});

    if(user.membership === "Pro"){
        // if user subscription is Pro we check if the subscriptionEnds is less than today
        // if yes we set the user subscriptuion to Basic and subscriptionEnds to null
        // if not we return status 200
        if(user.subscriptionEnds < new Date()){
            await db.db.collection("users").updateOne({_id: ObjectId(uid)}, {$set: {membership: "Basic",subscriptionEnds: null}});
            return res.status(200).json({message: "Subscription updated",membership: "Basic"});
        }else{
            return res.status(200).json({message: "Subscription is valid",membership: "Pro"});

        }
    }
    return res.status(200).json({message: "Subscription is not found",membership: "Basic"});

}