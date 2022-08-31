import React from "react";
import ScoreItemHistory from "./ScoreItemHistory";
import TableChart from "./TableChart";


const ItemHistory = ({item,difficulty}) => {


    // function that returns a random color from this 3 colors: #02C8B6,#CD08B0,#089EFF

    const keyword = ' This is a test keyword and i love it you know man '

    // function to check string length is heigher than 20 carachters if it is we add ... at the end of the string
    const checkStringLength = (str) => {
        if (str.length > 20) {
            return str.substring(0, 40) + "...";
        } else {
            return str;
        }
    }




    // function that takes date and return a string with the date format: dd MMM yyyy
    const formatDate = (date) => {
        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }






    return (
        <div className="w-full border rounded-md shadow-sm border-border-color-light bg-white  xl:h-[150px] lg:h-[150px]  md:h-fit h-fit flex md:flex-nowrap flex-wrap mt-2 ">
            {/* left side  */}
            
            <div className="md:w-1/4 w-1/3  md:h-full md:min-h-0 min-h-10 bg-color-dashboard-bg border-r border-border-color-light flex flex-col items-center py-3 justify-center">
                {/* Small button */}
                <div className="bg-white border w-20 p-2 flex justify-center items-center"> <span className={"  md:text-sm text-xs font-bold text-primary-color "}>Keyword</span> </div>
                {/* Keyword */}
                <p className="w-[80%] h-full mt-4 text-center font-bold md:text-l text-xs text-text-primary-color">{checkStringLength(item.keyword)}</p>
            </div>
            
            {/* Date */}
            <div className="flex flex-col md:w-1/5 w-1/3 border-r border-border-color-light p-4 ">
                <div className="flex flex-col ">
                    <span className="font-bold my-1">Last Crawl</span>
                    <span className="text-xs text-text-primary-color">{formatDate(item.created_at)}</span>
                </div>
                <div className="flex flex-col ">
                    <span className="font-bold my-1">Cpc</span>
                    <span className="text-xs text-text-primary-color">{item.cpc}</span>
                </div>

            </div>

            {/* Seo Score */}
            <div className="md:w-1/4 w-1/3  p-4 border-r border-r-border-color-light" >
                <div className="flex flex-col ">
                    <span className="font-bold my-1">Score</span>
                    <ScoreItemHistory difficulty={difficulty} />
                    <span className="font-bold my-1">Difficulty</span>
                    <span className="text-xs text-text-primary-color">

                    {difficulty > 80
                              ? 'Very Hard'
                              : difficulty > 60
                              ? 'Possible'
                              : difficulty > 40
                              ? 'Possible '
                              : difficulty > 20
                              ? 'Still Easy'
                              : 'Very Easy'}
                    </span>
                </div>
            </div>

            {/* Seo Score */}
            <div className="w-full  md:flex hidden pt-4 pb-0 flex flex-col" >
                <div className="flex flex-col w-full md:flex-grow ">
                    <span className="font-bold px-4">Search history</span>
                    <TableChart data={item.result[0].monthly} />
                </div>


            </div>
        </div>
    )
}


export default ItemHistory