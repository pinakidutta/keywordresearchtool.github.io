
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


function PurchaseVerification (){

    const router = useRouter();

    const { purchaseId, result } = router.query;
    const [isError,setIssError] = useState(false);


    useEffect(() => {
        // we send the purchsae id to verify
     if(purchaseId){
        axios.post( process.env.NEXT_PUBLIC_PROD_URL +'/api/pay/verify', {purchaseId: purchaseId[0]}).then(response => {
            if(response.status === 200) {
                router.push('/login');
            }
         }
         ).catch(error => {
                setIssError(true);
            }
        );
     }
    }, [purchaseId]);



    return(
        <div>
            {isError ? <p>Error occured</p> : <p>Finalizing Purchase ...</p>}
        </div>
    )
}

export default PurchaseVerification;