import { connectToDatabase } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler (req,res){

    // check if its a post request
    if(req.method !== 'POST'){
        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }
    // get user id from session jwt token
    let session = await getSession({ req });
    if(!session){
        res.status(401).json({
            message: 'You are not logged in'
        })
        return
    }
    let uid = session.token.uid;

    // check if the user is admin 
    let db = await connectToDatabase()
    let user = await db.db.collection('users').findOne({_id:ObjectId(uid)})
    if(!user){
        res.status(404).json({
            message: 'User not found'
        })
        return
    }
    if(user.role !== 'admin'){
        res.status(403).json({
            message: 'You are not an admin'
        })
        return
    }

    let resultsPerPage = 1;
    let page = req.body.page ;
    let skip = (page - 1) * resultsPerPage;

    // get subscriptions 

    let subscriptions = await db.db.collection('subscriptions').find({}).skip(skip).limit(resultsPerPage).toArray();
    
    // get total subscriptions
    let totalSubscriptions = await db.db.collection('subscriptions').countDocuments();

    // return subscriptions

    return res.status(200).json({
        subscriptions,
        totalSubscriptions
    })




}