import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req,res){


    if (req.method !== 'POST') { 
        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }



   // check if the user is verified
    let db = await connectToDatabase()
    let user = await db.db.collection('users').findOne({email:req.body.email})
    if(user){

        if(user.verified){

            res.status(200).json({
                message: 'User already verified'
            })
            return
        }else{
            res.status(400).json({
                message: 'User not verified'
            })
            return

        }
    }
    


    
}