import React, { useEffect } from 'react';

import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip as ReTooltip,
   ResponsiveContainer,
} from 'recharts';
import { BsQuestionCircle } from 'react-icons/bs';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function SearchHistory({ data, type }) {
   const [finalData, setFinalData] = React.useState([]);

   // function that tackes an array of objects and replace the month field number with name
   const monthName = (month) => {
      switch (month) {
         case 1:
            return 'Jan';
         case 2:
            return 'Feb';
         case 3:
            return 'Mar';
         case 4:
            return 'Apr';
         case 5:
            return 'May';
         case 6:
            return 'Jun';
         case 7:
            return 'Jul';
         case 8:
            return 'Aug';
         case 9:
            return 'Sep';
         case 10:
            return 'Oct';
         case 11:
            return 'Nov';
         case 12:
            return 'Dec';
         default:
            return '';
      }
   };

   useEffect(() => {
      if (data !== undefined) {
         console.log('data', data);
         let mockDataFinalised;
         if (type == 'lookup') {
            mockDataFinalised = data.map((item) => {
               item.month = monthName(item.month);

               return item;
            });
         } else {
            mockDataFinalised = data;
         }

         setFinalData([...mockDataFinalised]);
      } else {
         setFinalData(mockData);
      }
   }, [data]);

   const mockData = [
      {
         year: 2022,
         month: 2,
         search_volume: 90500,
      },
      {
         year: 2022,
         month: 1,
         search_volume: 135000,
      },
      {
         year: 2021,
         month: 12,
         search_volume: 110000,
      },
      {
         year: 2021,
         month: 11,
         search_volume: 110000,
      },
      {
         year: 2021,
         month: 10,
         search_volume: 135000,
      },
      {
         year: 2021,
         month: 9,
         search_volume: 165000,
      },
      {
         year: 2021,
         month: 8,
         search_volume: 135000,
      },
      {
         year: 2021,
         month: 7,
         search_volume: 135000,
      },
      {
         year: 2021,
         month: 6,
         search_volume: 165000,
      },
      {
         year: 2021,
         month: 5,
         search_volume: 110000,
      },
      {
         year: 2021,
         month: 4,
         search_volume: 110000,
      },
      {
         year: 2021,
         month: 3,
         search_volume: 110000,
      },
   ];

   return (
      <div className=" flex flex-grow flex-col h-full justify-center items-center ">
         {/* difficulty top */}
         <div className="flex px-4 py-2 w-full">
            <Tooltip
               className="ml-auto"
               title="Monthly average search volume rate"
            >
               <IconButton>
                  <BsQuestionCircle className=" w-4 h-4" />
               </IconButton>
            </Tooltip>
         </div>

         <ResponsiveContainer width={'90%'} height={'80%'}>
            <BarChart barSize={20} data={finalData}>
               <XAxis style={{ fontSize: '0.9em' }} dataKey="month" />
               <YAxis style={{ fontSize: '0.9em' }} />
               <ReTooltip cursor={{ fill: '#ebebeb' }} />
               <Bar
                  radius={[10, 10, 0, 0]}
                  dataKey="search_volume"
                  fill="#82ca9d"
               />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}

export default SearchHistory;
