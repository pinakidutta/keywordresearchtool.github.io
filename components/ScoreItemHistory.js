import React, { useEffect,useState } from "react";

const ScoreItemHistory = ({difficulty}) => {


    const[percentage,setPercentage] = useState(0)

    useEffect(() => {
        // convert the difficulty to a percentage string
         var finalPercentage =  (difficulty / 100).toFixed(2)
        setPercentage(finalPercentage )
        console.log('the percentage is ' + difficulty)
        
    }, [])

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            
            <div style={{width:difficulty+'%', height:'0.625rem', borderRadius:'9999px', backgroundColor:
            
                difficulty > 80 ? "#e74c3c " :
                    difficulty > 60 ? "#f1530f" :
                        difficulty > 40 ? "#f1c40f" :
                            difficulty > 20 ? "#2ecc71" :
                            "#2ecc71"
            
            
            , transition:'all 0.3s'}} >
                
            </div>
        </div>
    )
}

export default ScoreItemHistory
