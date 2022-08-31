import { connectToDatabase } from "../../../../../lib/mongodb"
import { getSession } from "next-auth/react"
import { ObjectId } from "mongodb"
const bcrypt = require("bcryptjs")
export default  async function handler(req, res) {
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

    // get the user from the session token
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

    // check if the user role is admin 
    // if not return unothorized
    const db = await connectToDatabase()
    const user = await db.db.collection('users').findOne({ '_id': ObjectId(uid) })
    if (user.role !== 'admin') {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
            error: 'Forbidden'
        }))
        return
    }

    // find a user by id and make changes 
    let targetUserId = req.body.uid
    let type = req.body.type;

    let targetUser = await db.db.collection('users').findOne({ '_id': ObjectId(targetUserId) })
    if (!targetUser) {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        })
        return    res.end(JSON.stringify({
            error: 'User not found'
        }))
        
    }else{
   
        /// switch case on type
        switch (type) {
            case 'status':
                let email = req.body.email;
                let password = req.body.password;
                let status = req.body.status
                
                // check if the email is given
                // if it is we will update the email but we check if not exists in the database first
                if (email) {
                    // check if the email is already exists
                    let user = await db.db.collection('users').findOne({ 'email': email })
                    if (user) {
                        res.writeHead(409, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify({
                            error: 'Email already exists'
                        }))
                        
                    }
                    // update the email
                    await db.db.collection('users').updateOne({ '_id': ObjectId(targetUserId) }, { $set: { 'email': email } })
                }
                if(password){
                    let hashedPassword = await bcrypt.hash(password, 10)
                    await db.db.collection('users').updateOne({ '_id': ObjectId(targetUserId) }, { $set: { 'password': hashedPassword } })
                }
                if(status){
                    await db.db.collection('users').updateOne({ '_id': ObjectId(targetUserId) }, { $set: { 'status': status } })
                
                }

                /// return response 
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify({
                    message: 'User updated'
                }))
                return

            break;

            case 'subscription':
                let membership = req.body.membership
                let subscriptionEnds = req.body.subscriptionEnds
                
                // we set the 2 values for the target user in the database
                await db.db.collection('users').updateOne({ '_id': ObjectId(targetUserId) }, { $set: { 'membership': membership, 'subscriptionEnds': new Date(subscriptionEnds) } })
                /// return response
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify({
                    message: 'User updated'
                }))
                return
                
                
            break;

        default:
            break;
        }


       

        
        
    }





}