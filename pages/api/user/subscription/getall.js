import { connectToDatabase } from '../../../../lib/mongodb';
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

   let id = req.body.userId;

   // search in subscitions collections and return all documents where uid ==  id
   let subscriptions = await db.db
      .collection('subscriptions')
      .find({ uid: id })
      .toArray();
   if (subscriptions) {
      return res.status(200).json({
         message: 'success',
         subscriptions: subscriptions,
      });
   } else {
      return res.status(400).json({
         message: 'No subscriptions found',
      });
   }
}
