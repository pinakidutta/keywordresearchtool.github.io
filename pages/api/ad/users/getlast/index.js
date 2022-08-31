import {connectToDatabase} from '../../../../../lib/mongodb'
import { getSession } from 'next-auth/react'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {

    // check if it is a not post request 
    // return error
    if (req.method !== 'POST') {
        res.writeHead(405, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
            error: 'Method not allowed'
        }))
        return
    }

    // get the user uid from session token
    const session = await getSession({ req })
    if (!session) {
        res.writeHead(401, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
            error: 'Unauthorized'
        }))
        return
    }

    const uid = session.token.uid;


    // connect to database
    const db = await connectToDatabase()
    // check if the user role is admin
    const user = await db.db.collection('users').findOne({'_id': ObjectId(uid) })
    if (user.role !== 'admin') {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
            error: 'Forbidden'
        }))
        return
    }

    // get the last 10 users from database using createdAt field
    // projection uid, email, username, createdAt and role fields
    const users = await db.db.collection('users').find({}).sort({ createdAt: -1 }).limit(10).project({
        _id: 1,
        email: 1,
        createdAt: 1,
        verified:1,
        membership:1,
        role: 1,
        status:1,
        usage:1,
    }).toArray()

    
    
    // return the users
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(users))
    

}

