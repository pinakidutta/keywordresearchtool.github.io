import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
export default function Verify(){
    const router = useRouter();
    const {verifyID} = router.query;

    // in the useffect we will check if the user is verified
    // using the endpoint /api/user/verify/
    // if the user is verified we will redirect to /dashboard
    // if the user is not verified we will redirect to /login
    // if the user is not found we will redirect to /register

  
    if(verifyID !== undefined){
        
        axios.post( process.env.NEXT_PUBLIC_PROD_URL +`/api/user/verify`,{verificationCode:verifyID[0] }).then(response => {
            if(response.status === 200){
                router.push('/dashboard')
            }
        }).catch(error => {
            if(error.response.status === 404){
                router.push('/register')
            }
            else{
                router.push('/login')
            }
        })
    }



    return (
     <div>
         Verifying your account ...
     </div>
    )

}