import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      res.status(405).json({
         message: 'Method not allowed',
      });
      return;
   }

   let db = await connectToDatabase();
   let session = await getSession({ req });

   // check if user is logged in
   if (!session) {
      res.status(401).json({
         message: 'Unauthorized',
      });
      return;
   }

   let id = session.token.uid;

   let keywordSearchIncNumber = req.body.keywordSearchIncNumber;
   let KeywordsReturned = req.body.KeywordsReturned;

   // finde users and add 1 to usage.keywordSearches
   let user = db.db.collection('users').findOne({ _id: ObjectId(id) });
   if (user) {
      await db.db.collection('users').updateOne(
         { _id: ObjectId(id) },
         {
            $inc: {
               'usage.keywordSearches': keywordSearchIncNumber,
               'usage.keywordsReturned': KeywordsReturned,
            },
         }
      );

      /// increment totalKeywordsSearched in inits collection
      await db.db
         .collection('inits')
         .updateOne({}, { $inc: { totalKeywordsSearched: 1 } });
   }
   return res.status(200).json({
      message: 'success',
   });
}
