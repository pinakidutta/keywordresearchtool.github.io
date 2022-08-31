import axios from "axios";

export default async function handler(req, res) {


    console.log('send request to api');
    
    axios.post("http://localhost:4000").then(response => {
         return res.status(200).json({
            response:response.data
        });
    }
    )

}