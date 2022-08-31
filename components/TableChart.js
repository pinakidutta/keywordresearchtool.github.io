
import React, { useEffect } from "react";


import {  Tooltip as ReTooltip, ResponsiveContainer, AreaChart , Area} from 'recharts';
import {  BsQuestionCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';




function TableChart({ data }) {

    const[finalData, setFinalData] = React.useState([]);


    // function that tackes an array of objects and replace the month field number with name
    const monthName = (month) => {
        switch (month) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
            default:
                return "";
        }
    }



    useEffect(() => {
        if(data !== undefined){
            console.log('data', data);
      let  mockDataFinalised = data.map(item => {
            item.month = monthName(item.month);
    
            return item;
        })

        setFinalData([... mockDataFinalised])}
        else{
            setFinalData(mockData);
        }
  
    }, [data])



    const mockData = [
        {
            "year": 2022,
            "month": 2,
            "search_volume": 90500
        },
        {
            "year": 2022,
            "month": 1,
            "search_volume": 135000
        },
        {
            "year": 2021,
            "month": 12,
            "search_volume": 110000
        },
        {
            "year": 2021,
            "month": 11,
            "search_volume": 110000
        },
        {
            "year": 2021,
            "month": 10,
            "search_volume": 135000
        },
        {
            "year": 2021,
            "month": 9,
            "search_volume": 165000
        },
        {
            "year": 2021,
            "month": 8,
            "search_volume": 135000
        },
        {
            "year": 2021,
            "month": 7,
            "search_volume": 135000
        },
        {
            "year": 2021,
            "month": 6,
            "search_volume": 165000
        },
        {
            "year": 2021,
            "month": 5,
            "search_volume": 110000
        },
        {
            "year": 2021,
            "month": 4,
            "search_volume": 110000
        },
        {
            "year": 2021,
            "month": 3,
            "search_volume": 110000
        }
    ]

 
    




    return (
        <div className="  flex flex-grow flex-col h-full justify-center items-center ">
            <ResponsiveContainer width={"100%"} height={"100%"}  >
                <AreaChart data={finalData}  >

                <Area type="monotone" dataKey="search_volume" stroke="#10A37F" fill="#8de3ce" />

                    <ReTooltip  cursor={{ fill: '#ebebeb' }} />
                </AreaChart>
            </ResponsiveContainer>

        </div>
    )
}


export default TableChart;
