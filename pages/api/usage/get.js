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

  // we get the usage object from the user
  let user = await db.db.collection('users').findOne({ _id: ObjectId(id) });
  if (user) {
    let usage = user.usage;
    return res.status(200).json({
      message: 'success',
      usage: usage,
    });
  } else {
    return res.status(400).json({
      message: 'User not found',
    });
  }
}
