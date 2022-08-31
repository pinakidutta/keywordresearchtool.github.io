import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {

    // check if it is a post request
    if (req.method !== 'POST') {
        res.status(405).json({
            message: 'Method not allowed'
        })
        return
    }
    // we connect to database
    let db = await connectToDatabase()

    // we check if there is an init  table with at least 1 document
    let init = await db.db.collection('inits').findOne({})

    // check if there is an init  table with at least 1 document
    if (!init) {
        return res.status(400).json({
            message: 'Need initialisation'
        })

    }else{

        return res.status(200).json({
            ls:init.ls, // lsence 
            message: 'Initialised'
        })
    }

}