import { connectToDatabase } from '../../../lib/mongodb';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
   // check if request is a post
   if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
   }

   // get session
   const session = await getSession({ req });
   if (!session) {
      return res.status(401).send('Unauthorized');
   }

   // get uid from session token
   const uid = session.token.uid;

   // get user from database
   // projection membership, subscriptionEnds

   const db = await connectToDatabase();

   // get last 10 notifications from user collection
   const user = await db.db
      .collection('users')
      .findOne({ _id: ObjectId(uid) }, { projection: { notifications: 1 } });

   if (user.notifications) {
      // return
      res.status(200).json({
         notifications: user.notifications,
      });
   }else{
    res.status(200).json({
        notifications: [],
     });
   }

}
