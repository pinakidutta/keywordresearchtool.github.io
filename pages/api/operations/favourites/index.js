import { connectToDatabase } from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";
export default async function handler(req,res){

    // check if its a post reuqest
    if(req.method !== 'POST'){
            
            res.status(405).json({
                message: 'Method not allowed'
            })
            return
        }


    // get the session 
    let session = await getSession({ req })

    let id = await session.token.uid
  
    // find the user and return all his favourites if the favourties colection exists
    let db = await connectToDatabase()

    // check if user exists

    let user = await db.db.collection('users').findOne({_id: ObjectId(id)})

    if(user){

        let favourites
        if(!user.favourites){
             favourites = []

        }
      // get all favourites from the user
      
       favourites = user.favourites

        res.status(200).json({
            favourites
        })
    }else{
        res.status(404).json({  
            favourites: [],
            message: 'User not found'
        })
    }



}