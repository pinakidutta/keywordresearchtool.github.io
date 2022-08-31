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

   // get the user by id and get history array
   let user = await db.db.collection('users').findOne({ _id: ObjectId(id) });
   if (user) {
      let historyIds = user.history;
      console.log('found the history : '+ historyIds);

      let history = [];
      for (let index = 0; index < historyIds.length; index++) {
         // find history by id and push to history array projection : keyword,difficulty,created_at.  limit :20
         let historyItem = await db.db
            .collection('history')
            .findOne(
               { _id: ObjectId(historyIds[index]) },
               {
                  projection: { keyword: 1, difficulty: 1, created_at: 1,volume:1,cpc:1 },
                  limit: 20,
               }
            );
         history.push(historyItem);
      }

      return res.status(200).json({
         message: 'success',
         history: history,
      });
   }
   //
}
