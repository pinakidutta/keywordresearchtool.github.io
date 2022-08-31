import { connectToDatabase } from '../../../../lib/mongodb';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import panel from '../../../../var';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).send({
         error: 'Method not allowed',
      });
   }

   // we get the  session getSession
   const session = await getSession({ req });
   // if no session return error
   if (!session) {
      return res.status(401).send({
         error: 'Unauthorized',
      });
   }

   // we get the uid from session token
   const uid = session.token.uid;

   //get the ip from the request

   var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

   // connect to database
   const db = await connectToDatabase();
   // we need to check if subscriptions is on
   // get first document in inits collection
   const init = await db.db.collection('inits').findOne({});

   // we need to check if the lic is rg then we will proceed with the search directly

   if (init.lic === 'rg') {
      await axios
         .post(panel + '/api/operations/get/keywords', {
            domain: req.body.domain,
            keyword: req.body.keyword,
            ls: req.body.ls,
         })
         .then(async (response) => {
            if (response.status === 200) {
               let success = true;
               let data = response.data;
               /// we will use the mock data
               console.log(response.data);
               let result = response.data.result[0].items;
               // let result = mockKeywordResult.result[0].items;

               // in real life case we will get the object from other place
               // puch each item to an array
               let items = [];
               result.forEach((item) => {
                  items.push({
                     keyword: item.keyword,
                     language_code: item.language_code,
                     cpc: item.keyword_info.cpc,
                     monthly_searches: item.keyword_info.monthly_searches,
                     difficulty: item.keyword_properties.keyword_difficulty,
                     competition: item.keyword_info.competition,
                  });
               });

               if (success) {
                  setTimeout(() => {
                     return res.status(200).json({
                        result: items,
                        message: 'success',
                     });
                  }, 3000);
               } else {
                  return res.status(400).json({
                     message: 'Failed from the backend',
                  });
               }
            }
         })
         .catch(async (error) => {
            console.log(error);
            return res.status(400).json({
               message: 'Failed from the backend',
            });
         });
   } else {
      // if subscriptions is off we dont check the user
      if (init.subscriptionsToggle === false) {
         /// njibo ala3ib mn panel

         const user = await db.db.collection('users').findOne({ _id: ObjectId(uid) });

         if (user.usage.keywordSearches >= init.basicUsageLimit) {
            return res.status(400).json({
               message: 'You have reached your usage limit, Please Upgrade your membership.',
            });
         }

         await axios
            .post(panel + '/api/operations/get/keywords', {
               domain: req.body.domain,
               keyword: req.body.keyword,
               ls: req.body.ls,
            })
            .then(async (response) => {
               if (response.status === 200) {
                  let success = true;
                  let data = response.data;
                  /// we will use the mock data
                  console.log(response.data);
                  let result = response.data.result[0].items;
                  // let result = mockKeywordResult.result[0].items;

                  // in real life case we will get the object from other place
                  // puch each item to an array
                  let items = [];
                  result.forEach((item) => {
                     items.push({
                        keyword: item.keyword,
                        language_code: item.language_code,
                        cpc: item.keyword_info.cpc,
                        monthly_searches: item.keyword_info.monthly_searches,
                        difficulty: item.keyword_properties.keyword_difficulty,
                        competition: item.keyword_info.competition,
                     });
                  });

                  if (success) {
                     setTimeout(() => {
                        return res.status(200).json({
                           result: items,
                           message: 'success',
                        });
                     }, 3000);
                  } else {
                     return res.status(400).json({
                        message: 'Failed from the backend',
                     });
                  }
               }
            })
            .catch(async (error) => {
               console.log(error);
               return res.status(400).json({
                  message: 'Failed from the backend',
               });
            });
      }
      // if subscriptions is on we check the user if its Basic Or pro
      // if basic we check his usage if its over the limit we return error

      if (init.subscriptionsToggle === true) {
         // get the user
         const user = await db.db.collection('users').findOne({ _id: ObjectId(uid) });
         // if user is basic we check his usage
         if (user.membership == 'Basic') {
            if (user.usage.keywordSearches >= init.basicUsageLimit) {
               return res.status(400).json({
                  message: 'You have reached your usage limit, Please Upgrade your membership.',
               });
            } else {
               // if user is pro we do it normallypl
               /// njibo ala3ib mn panel
               await axios
                  .post(panel + '/api/operations/get/keywords', {
                     domain: req.body.domain,
                     keyword: req.body.keyword,
                     ls: req.body.ls,
                  })
                  .then(async (response) => {
                     if (response.status === 200) {
                        let success = true;
                        let data = response.data;
                        /// we will use the mock data
                        console.log(response.data);
                        let result = response.data.result[0].items;
                        // let result = mockKeywordResult.result[0].items;

                        // in real life case we will get the object from other place
                        // puch each item to an array
                        let items = [];
                        result.forEach((item) => {
                           items.push({
                              keyword: item.keyword,
                              language_code: item.language_code,
                              cpc: item.keyword_info.cpc,
                              monthly_searches: item.keyword_info.monthly_searches,
                              difficulty: item.keyword_properties.keyword_difficulty,
                              competition: item.keyword_info.competition,
                           });
                        });

                        if (success) {
                           setTimeout(() => {
                              return res.status(200).json({
                                 result: items,
                                 message: 'success',
                              });
                           }, 3000);
                        } else {
                           return res.status(400).json({
                              message: 'Failed from the backend',
                           });
                        }
                     }
                  })
                  .catch(async (error) => {
                     console.log(error);
                     return res.status(400).json({
                        message: 'Failed from the backend',
                     });
                  });
            }
         } else {
            // if user is pro we do it normally
            /// njibo ala3ib mn panel
            await axios
               .post(panel + '/api/operations/get/keywords', {
                  domain: req.body.domain,
                  keyword: req.body.keyword,
                  ls: req.body.ls,
               })
               .then(async (response) => {
                  if (response.status === 200) {
                     let success = true;
                     let data = response.data;
                     /// we will use the mock data
                     console.log(response.data);
                     let result = response.data.result[0].items;
                     // let result = mockKeywordResult.result[0].items;

                     // in real life case we will get the object from other place
                     // puch each item to an array
                     let items = [];
                     result.forEach((item) => {
                        items.push({
                           keyword: item.keyword,
                           language_code: item.language_code,
                           cpc: item.keyword_info.cpc,
                           monthly_searches: item.keyword_info.monthly_searches,
                           difficulty: item.keyword_properties.keyword_difficulty,
                           competition: item.keyword_info.competition,
                        });
                     });

                     if (success) {
                        setTimeout(() => {
                           return res.status(200).json({
                              result: items,
                              message: 'success',
                           });
                        }, 3000);
                     } else {
                        return res.status(400).json({
                           message: 'Failed from the backend',
                        });
                     }
                  }
               })
               .catch(async (error) => {
                  console.log(error);
                  return res.status(400).json({
                     message: 'Failed from the backend',
                  });
               });
         }
      }
   }
}




