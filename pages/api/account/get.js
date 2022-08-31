import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
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

    // check if the user exists 
    let db = await connectToDatabase()
    let user = await db.db.collection('users').findOne({_id:ObjectId(uid)})
    if(!user){
        res.status(404).json({
            message: 'User not found'
        })
        return
    }else{
        // we return this fields from the user : cookies,inAppNotification,emailNotification,firstname,lastname,username,membership,email
        let userData = {
            cookies:user.cookies,
            inAppNotification:user.inAppNotification,
            emailNotification:user.emailNotification,
            firstname:user.firstname,
            lastname:user.lastname,
            username:user.username,
            membership:user.membership,
            email:user.email,
            status:user.status
        
    }
    return res.status(200).json({
        userData
    })
    }
    

}