import { connectToDatabase } from '../../../../lib/mongodb';
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

   const db = await connectToDatabase();
   // add a document to notifications array
   const user = await db.db
      .collection('users')
      .findOne({ _id: ObjectId(uid) }, { projection: { notifications: 1 } });
   const notifications = user.notifications;
   notifications.push({
    notificationTitle: req.body.notificationTitle,
      notificationMessage: req.body.notificationMessage,
      date: new Date(),
      read:false
   });
   await db.db
      .collection('users')
      .updateOne(
         { _id: ObjectId(uid) },
         { $set: { notifications: notifications } }
      );
   // return
   return res.status(200).json({
      status: 'success',
   });
   
}
