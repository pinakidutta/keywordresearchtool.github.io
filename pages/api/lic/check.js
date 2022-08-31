import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
   // check if request is a post
   if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
   }

   const db = await connectToDatabase();

   // get the first document in inits collection
    const init = await db.db.collection('inits').findOne({});



   // return
   res.status(200).json({
      lic: init.lic,
   
   });
}
