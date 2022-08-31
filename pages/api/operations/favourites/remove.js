
import { connectToDatabase } from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";
export default async function handler (req,res){
  // check if it a post request
  // then we get the logged in email from req
  // then we add the favourited keyword to the favourites collection
  
    if(req.method !== 'POST'){
        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }

    let db = await connectToDatabase()

    // get session
    let session = await getSession({ req })
    let email = session.token.email
    let uid = session.token.uid
    

    let keyword = req.body.keyword

    //use email to find user and add the keyword to the favourites collection
    let user = await db.db.collection('users').findOne({email: email})
    if(user){
        // if the user does not contains favourite collection we create one
        if(!user.favourites){
            await db.db.collection('users').updateOne({email: email},{$set:{favourites:[]}})
        }
        
        // find the keyword in the favourites collection
        // and delete it
        let favourite = await db.db.collection('users').findOne({email: email, favourites: keyword})
        if(favourite){
            await db.db.collection('users').updateOne({email: email},{$pull:{favourites: keyword}})
            await db.db.collection('users').updateOne(
                { _id: ObjectId(uid) },
                {
                  $inc: {
                    'usage.favourites': -1,
                  },
                }
              );
        }
     return   res.status(200).json({
            message: 'Keyword removed from favourites'
        })
     
    }else{
        return res.status(404).json({
            message: 'User not found'
        })
    }

  


    

}