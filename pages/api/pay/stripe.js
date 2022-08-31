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

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const YOUR_DOMAIN = process.env.NEXT_PUBLIC_PROD_URL;

  const paymentKey =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const duration = req.body.duration;

  // connect to db
  const db = await connectToDatabase();

  // get the first document of inits collection projection halfYearPrice,monthlyPrice,yearlyPrice

  const priceDoc = await db.db
    .collection('inits')
    .findOne(
      {},
      {
        projection: {
          _id: 0,
          propricehalfyear: 1,
          proprice: 1,
          propriceyear: 1,
        },
      }
    );

  let price = 0;
  if (duration === '1 Month') {
    price = priceDoc.proprice * 100;
  } else if (duration === '6 Months') {
    price = priceDoc.propricehalfyear * 100;
  } else if (duration === '1 Year') {
    price = priceDoc.propriceyear * 100;
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: price,
            currency: 'usd',
            product_data: {
              name: 'Pro Membership',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/purchase/${paymentKey}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    // We need to generate a key, if the user redirected to success page we will check that payment id if it exist in our database
    // like this if someone directly accessed success page without paying we will not be able to get payment id

    // check PaymentsIntent collection if exist if not we create one

    if (!(await db.db.collection('PaymentsIntent'))) {
      await db.db.createCollection('PaymentsIntent');
    }

    // insert  a random key to PaymentsIntent collection and user id
    await db.db.collection('PaymentsIntent').insertOne({
      key: paymentKey,
      uid: uid,
      duration: duration,
      method: 'stripe',
      email: session.token.email,
      plan: 'Pro',
    });

    return res.json({ url: stripeSession.url }); // <-- this is the changed line
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
