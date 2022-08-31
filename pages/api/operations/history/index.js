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
        let session = await getSession({ req });
        let id = session.token.uid;

        // numbr per page
        let perPage = 4;
        let page = req.body.page ;
        let skip = (page - 1) * perPage;

        // check if user exists if it exist return the history collection use pagination using skip and limit
        
        let user = await db.db.collection('users').findOne({_id: ObjectId(id)})
        if(user){
   
            // we get all history ids from user
            let historyIds = user.history
            console.log(historyIds);

            let history = await db.db.collection('history').find({_id: {$in: historyIds}}).skip(skip).limit(perPage).toArray()
        
            return  res.status(200).json({
                history
            })
            
         // check if the length of the history is greater than > 10 then we return only the last 10 items
            // let history = user.history
            // if(history.length > 10){
            //     history = history.slice(history.length - 10, history.length)
            // }
            
            
            // return res.status(200).json({
            //     message: 'success',
            //     history: history,
            //     more: history.length > 10 ? true : false
            // })


        }else{
            return res.status(404).json({
                message: 'User not found'
            })
        }






    }