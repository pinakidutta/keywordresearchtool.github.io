import { connectToDatabase } from "../../lib/mongodb"

export default async function handler(req,res){

     let db = await connectToDatabase()

     await db.db.collection('users').insertOne({name:'John Smith'})
 
      res.status(200).json(db)
}