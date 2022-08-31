import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectID } from "bson";
import axios from "axios";
import panel from '../../../var.js'


export default async function handler(req, res) {

    /// Variable that we will get from the request

    let licenseKey = req.body.licenseKey;
    let email = req.body.email;
    let password = req.body.password;
    let domain = req.body.domain;


    // Check if the request is a post request
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method not allowed'
        })

    }

    /// check if license key is valid 
    await axios.post(`${panel}/api/licenses/check`, { licenseKey: licenseKey ,domain:domain}).then(async (response) => {
        if (response.data.message === 'License is valid') {
            // we connect to database
            let db = await connectToDatabase()
            // we check if we have an init collection
            let init = await db.db.collection('inits').findOne({})
            
            if (!init) {
                /// no init now we can create an admin account 
                // we create a users colletion  adn we get its id 

                let userId = new ObjectID()

                let hashedPassword = await bcrypt.hash(password, 10)
                await db.db.collection('users').insertOne({
                    _id: userId,
                    email,
                    password: hashedPassword,
                    role: 'admin',
                    membership: 'Basic',
                    createdAt: new Date(),
                    usage:{
                        keywordSearches:0,
                        onpageSearches:0,
                        keywordsReturned:0,
                        favourites:0,
                        totalCompSearches:0
                    },
                    status: 'active',
                    verified: true,
                    ipHistory: [],
                    verificationToken: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    verificationCode: Math.floor(1000 + Math.random() * 9000),
                    favourites: [],
                    notifications:[],
                    history: [],
                    firstname: '',
                    lastname: '',
                    username: '',
                    emailNotification: 'on',
                    inAppNotification: 'on',
                    cookies: 'on',
                    subscriptionEnd: null
                })

                // we create an inits collection 
                console.log(response.data)

                await db.db.collection('inits').insertOne({
                    _id: userId,
                    createdAt: new Date(),
                    websiteTitle: '',
                    websiteDescription: '',
                    websiteKeywords: '',
                    emailVerification: 'off',
                    websiteName: '',
                    paymentMethod: 'Both',
                    paypalkey: '',
                    proprice: '',
                    stripeclientkey: '',
                    subscriptions: '',
                    halfYearPrice: '',
                    monthlyPrice: '',
                    yearlyPrice: '',
                    paypalClientKey: '',
                    totalUsers: 1,
                    totalSubscriptions:0,
                    totalKeywordsSearched:0,
                    totalCompSearches:0,
                    messages:0,
                    subscriptions:0,
                    unreadMessages:0,
                    lic:response.data.license,
                    subscriptionsToggle: false,
                    basicUsageLimit:10,
                    basicCompLimit:10,


                })


                // return 200
                return res.status(200).json({
                    message: 'Success'
                })
            } else {
                // return that the use already exists
                return res.status(400).json({
                    message: 'Initialisation refused'
                })
            }
        } else {
            return res.json({
                message: 'License is invalid'
            });
        }
    }).catch(error => {
        console.log(error)
    }
    )
}