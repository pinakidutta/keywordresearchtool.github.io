import { connectToDatabase } from '../../../../lib/mongodb';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import panel from '../../../../var';
import axios from 'axios';


export default async function handler(req, res) {
   // check if request is a post
   if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed');
   }

   // check if its connected
   // get session
   const session = await getSession({ req });
   if (!session) {
      return res.status(401).send('Unauthorized');
   }
   // get user id from session
   let id = session.token.uid;
   var url = await req.body.url;
   var domain = await req.body.domain;
   var ls = await req.body.ls;

   let result = null;
   let db = await connectToDatabase();

   const init = await db.db.collection('inits').findOne({});

   // we need to check if the lic is rg then we will proceed with the search directly
   if (init.lic === 'rg') {
      // query
      result = await startCompetitorResearch(url, id, db, domain, ls);
   } else {
      // if subscriptions is off we dont check the user
      if (init.subscriptionsToggle === false) {
         result = await startCompetitorResearch(url, id, db, domain, ls);
      }
      if (init.subscriptionsToggle === true) {
         // get the user
         console.log('innnnnnnnnnnn');
         const user = await db.db.collection('users').findOne({ _id: ObjectId(id) });

         if (user.membership == 'Basic') {
            if (user.usage.totalCompSearches >= init.basicCompLimit) {
               return res.status(400).json({
                  message: 'You have reached your usage limit, Please Upgrade your membership.',
               });
            } else {
               result = await startCompetitorResearch(url, id, db, domain, ls);
            }
         } else {
            result = await startCompetitorResearch(url, id, db, domain, ls);
         }
      }
   }

   res.status(200).json(result);
}

function returnKeywords(items) {
   var array = [];
   if (items === null) {
      return [];
   }

   for (let index = 0; index < items.length; index++) {
      array.push(items[index].keyword_data);
   }
   return array;
}

function returnOrganicPositions(result) {
   return result.metrics.organic;
}

function returnPaidPositions(result) {
   return result.metrics.paid;
}

// call bnd for onpageSeo
async function getOnpageSeo(url, domain, ls) {
   var result = null;
   await axios
      .post(panel+'/api/operations/get/onpage', { url: url, domain: domain, ls: ls })
      .then((res) => {
         result = res.data.result;
      })
      .catch((err) => {});
   return result;
}

async function startCompetitorResearch(url, id, db, domain, ls) {
   // query
   const onPageResult = await getOnpageSeo(url, domain, ls);
   const competitorResult = await getCompetitor(url, domain, ls);
   await addToUsage(id, db);

   const result = competitorResult;
   const items = competitorResult.items;

   var rankedKeywordsArray = returnKeywords(items); // This array will hold all the keywords that this domain rank for
   var organicPositions = returnOrganicPositions(result); // This array will hold all the organic positions for this domain
   var paidPositions = returnPaidPositions(result); // This array will hold all the paid positions for this domain

   return {
      rankedkeywords: rankedKeywordsArray,
      organicPositions: organicPositions,
      paidPositions: paidPositions,
      onPageResult: onPageResult,
   };
}

// add usage to totalCompSearches
async function addToUsage(id, db) {
   let user = db.db.collection('users').findOne({ _id: ObjectId(id) });
   if (user) {
      await db.db.collection('users').updateOne(
         { _id: ObjectId(id) },
         {
            $inc: {
               'usage.totalCompSearches': 1,
            },
         }
      );

      /// increment totalKeywordsSearched in inits collection
      await db.db.collection('inits').updateOne({}, { $inc: { totalCompSearches: 1 } });
   }
}
// call bnd for competitors
async function getCompetitor(url, domain, ls) {
   var result = null;
   await axios
      .post(panel+'/api/operations/get/competitor', {
         url: url,
         domain: domain,
         ls: ls,
      })
      .then((res) => {
         result = res.data.result;
         //  console.log(result);
      })
      .catch((err) => {});
   return result;
}
