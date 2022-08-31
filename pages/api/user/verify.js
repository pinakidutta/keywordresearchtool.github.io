
import { connectToDatabase } from "../../../lib/mongodb"


export default async function handler(req,res){


    if (req.method !== 'POST') { 

        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }

    // get verification code from request
    let verificationCode = req.body.verificationCode;

    // get verification code from request
    // look for there is a user with that verification code
    // if there is a user with that verification code set verified to true
    // if there is no user with that verification code return error
    console.log(verificationCode);
 

    // get user with that verification code
    let db = await connectToDatabase()
    let user = await db.db.collection('users').findOne({verificationToken:verificationCode})
    if(user){
        // set verified to true
        await db.db.collection('users').updateOne({verificationToken:verificationCode},{$set:{verified:true}})
        // return response
        res.status(200).json({
            message: 'User verified'
        })
    }
    else{
        // return error
        res.status(400).json({
            message: 'User not found'
        })
    }


}