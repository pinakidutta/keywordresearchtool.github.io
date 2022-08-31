import { connectToDatabase } from '../../../../lib/mongodb';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
export default async function handler(req, res) {
  // check if it a post request
  // then we get the logged in email from req
  // then we add the favourited keyword to the favourites collection

  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    });
    return;
  }

  let db = await connectToDatabase();

  // get email and password from request
  let keyword = req.body.keyword;
  // get uid from  session
  let session = await getSession({ req });
  let uid = session.token.uid;

  //use email to find user and add the keyword to the favourites collection
  let user = await db.db.collection('users').findOne({ _id: ObjectId(uid) });
  if (user) {
    // if the user does not contains favourite collection we create one
    if (!user.favourites) {
      await db.db
        .collection('users')
        .updateOne({ _id: ObjectId(uid) }, { $set: { favourites: [] } });
    }
    // check if the keyword is already in the favourites collection
    // if it is we return an error
    let favourite = await db.db
      .collection('users')
      .findOne({ _id: ObjectId(uid), favourites: keyword });
    if (favourite) {
      res.status(400).json({
        message: 'Keyword already in favourites',
      });
      return;
    }
    let favourites = user.favourites;
    keyword.favourited = true;

    favourites.push(keyword);
    await db.db
      .collection('users')
      .updateOne({ _id: ObjectId(uid) }, { $set: { favourites: favourites } });
    await db.db.collection('users').updateOne(
      { _id: ObjectId(uid) },
      {
        $inc: {
          'usage.favourites': 1,
        },
      }
    );
  }

  res.status(200).json({
    message: 'Keyword added to favourites',
  });
}
