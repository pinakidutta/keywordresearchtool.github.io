import React from 'react';
import KeywordSearch from '../../../components/KeywordSearch';
import DashLayout from '../../../Layouts/dashLayout';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { paginate, checkStringLength } from '../../../utils';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { BsQuestionCircle } from 'react-icons/bs';
import SearchHistory from '../../../components/SearchHistory';
import { BsFillStarFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSession, getSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import {
   setToast,
   setToastTitle,
   setToastMessage,
   setToastType,
} from '../../../redux/actions/initsActions';
import * as searchActions from '../../../redux/actions/keywordSearchActions';
import axios from 'axios';

function Lookup({
   keyword,
   result,
   difficulty,
   setToast,
   search_volume_history,
   setKeyword,
   setResult,
   setDifficulty,
   setSearchVolumeHistory,
   setToastTitle,
   setToastMessage,
   setToastType,
}) {
   const { data: session } = useSession();

   // array that hold the lookups on search result
   const [searchResult, setSearchResult] = React.useState([]);

   // state is loading
   const [isLoading, setIsLoading] = React.useState(false);
   // form hook
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   // This will hold the position of the current keyword history
   // when the user clicks on an other keyweord we set its state
   // to here so we can show that one instead of the first one
   const [currentHistoryPos, setCurrentHistoryPos] = React.useState(0);

   // handle keyword  search form submit using react hook form
   const onKeywordSearch = (data) => {
      console.log(data);
      // check if there is any lookup that contains the keyphrase
      const lookups = fetchedKeywords.filter((lookup) =>
         lookup.keyword.toLowerCase().includes(data.searchPhrase.toLowerCase())
      );

      // if there is any lookup that contains the keyphrase
      if (lookups.length > 0) {
         // set the search result to the lookups
         setSearchResult(lookups);
         // set the page number to 1
         setLastLookupPage(1);
      } else {
         // if there is no lookup that contains the keyphrase
         // set the search result to empty array
         setSearchResult([]);
         // set toast to true (showed)
         setToastType('danger');
         setToastTitle('No Lookup Found');
         setToastMessage('Please try another keyword');
         setToast(true);
         // after 3sconds set toast to false (hidden)
         setTimeout(() => {
            setToast(false);
         }, 3000);
      }

      // if search pharse is empry
      // we cleare searchresult state
      if (data.searchPhrase === '') {
         setSearchResult([]);
      }
   };

   const [fetchedKeywords, setFetchedKeywords] = React.useState([
      // {
      //     id: 1,
      //     keyword: "Hello world how are  you doiing 1",
      //     date: "2020-01-01",
      //     status: "success",
      //     volume: "100",
      //     competitition: "100",
      //     difficulty: 80,
      //     cpc: "100",
      //     dailyImpression: "100",
      //     selected: false
      // }
   ]);
   const [selectedDifficulty, setSelectedDifficulty] = React.useState(0);
   const [mainKeywordDifficulty, setMainKeywordDifficulty] = React.useState(0);

   // map keywords fetched to the state of  fetched keywords array

   const mapResultToArray = (result) => {
      return result.map((item, index) => ({
         id: index,
         selected: false,
         keyword: item.keyword,
         volume: item.monthly_searches[11],
         monthly: item.monthly_searches,
         competition: item.competition,
         difficulty: item.difficulty,
         cpc: item.cpc,
         favourited: false,
         selected: false,
      }));
   };

   // add keyword to the search history
   const addKeywordToSearchHistory = (keywordPhrase, result, difficulty, volume, cpc) => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + `/api/operations/history/add`,
            {
               keyword: keywordPhrase,
               result: result,
               difficulty: difficulty,
               country: 'United States',
               volume: volume,
               cpc: cpc,
            },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               console.log('added to search history');
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   // state hold the page number of the last lookups table
   const [lastLookupPage, setLastLookupPage] = React.useState(1);

   // handle next page of last lookups
   function handleNextPage() {
      if (lastLookupPage <= 4) {
         setLastLookupPage(lastLookupPage + 1);
      }
   }
   // handle previous page of last lookups
   function handlePreviousPage() {
      if (lastLookupPage > 1) {
         setLastLookupPage(lastLookupPage - 1);
      }
   }

   const data = [
      {
         uv: 100,
         pv: 4567,
         fill: '#f0f0f0',
      },
      {
         uv: selectedDifficulty,
         pv: 4567,
         fill:
            selectedDifficulty > 80
               ? '#e74c3c'
               : selectedDifficulty > 60
               ? '#f1530f'
               : selectedDifficulty > 40
               ? '#f1c40f'
               : '#2ecc71',
      },
   ];

   // function that looks throu the result table
   // and if there is a result difficulty == null
   // we use randomNumber function to set a random number instead of null

   const lookForNull = (result) => {
      result.map((item) => {
         if (item.difficulty === null) {
            item.difficulty = randomNumber();
         }
      });
      return result;
   };

   // get the index of a keyword and set the cuurenthistorypos to that index
   const getIndex = (keyword) => {
      const index = fetchedKeywords.findIndex((item) => item.keyword === keyword);
      setCurrentHistoryPos(index);
   };

   const addToUsage = async (keywordSearchIncNumber, KeywordsReturned) => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/usage',
            { keywordSearchIncNumber, KeywordsReturned },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               console.log('added to usage');
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   // we get the ls from inits
   const getLs = async () => {
      var lic = '';
      await axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/init/ls', {})
         .then((res) => {
            lic = res.data.ls;
         })
         .catch((err) => {
            // return the message from error
            console.log(err.response.data.message);
         });
      return lic;
   };

   // handle search click
   const handleKeywordLookupSubmit = async (keyword, country) => {
      // set loading to true
      setIsLoading(true);
      // get ls
      let ls = await getLs();
      // we check if any of the country or the keyword is empty
      if (keyword === '') {
         setToastType('warning');
         setToastTitle('Field missing!');
         setToastMessage('Please fill all the fields');
         setToast(true);
         // after 3sconds set toast to false (hidden)
         setTimeout(() => {
            setToast(false);
         }, 3000);
         setIsLoading(false);
      } else {
         setLastLookupPage(1);
         axios
            .post(
               process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/keyword/search',
               { keyword: keyword, country, domain: window.location.hostname, ls: ls },
               { withCredentials: true }
            )
            .then((res) => {
               if (res.data.message === 'success') {
                  var result = mapResultToArray(res.data.result);
                  /// log result

                  setSelectedDifficulty(result[0].difficulty);
                  setMainKeywordDifficulty(result[0].difficulty);

                  result = lookForNull(result);
                  console.log(result);

                  // set fetched keywrods with the result
                  setFetchedKeywords(result);
                  setTimeout(() => {
                     console.log(fetchedKeywords);
                  }, 500);
                  // we add the keyword to history

                  // set loading to false
                  setIsLoading(false);
                  // add the keyword to history
                  addKeywordToSearchHistory(
                     keyword,
                     result,
                     result[0].difficulty,
                     result[0].monthly[0],
                     result[0].cpc
                  );
                  // we add statistic to usage
                  addToUsage(1, result.length);
               }
            })
            .catch((err) => {
               if (err.response) {
                  setToastType('danger');
                  setToastTitle('Error!');
                  setToastMessage(err.response.data.message);
                  setToast(true);
                  setIsLoading(false);

                  // after 3sconds set toast to false (hidden)
                  setTimeout(() => {
                     setToast(false);
                  }, 3000);
               }
            });
      }
   };

   // function that order an array of objects by a given key
   const orderByKey = (array, key, direction) => {
      return array.sort(function (a, b) {
         var x = a[key];
         var y = b[key];
         if (direction === 'asc') {
            return x < y ? -1 : x > y ? 1 : 0;
         } else {
            return x > y ? -1 : x < y ? 1 : 0;
         }
      });
   };

   // function export an array as csv
   const exportToCsv = (array, fileName) => {
      var csv = array.map((item) => {
         return (
            item.keyword +
            ',' +
            item.monthly[0].search_volume +
            ',' +
            item.competition +
            ',' +
            item.difficulty +
            ',' +
            item.cpc +
            ',' +
            '\n'
         );
      });
      csv.unshift('Keyword,Volume,Competition,Difficulty,CPC\n');
      var csvData = new Blob(csv, { type: 'text/csv;charset=utf-8;' });
      var csvURL = null;
      if (navigator.msSaveBlob) {
         csvURL = navigator.msSaveBlob(csvData, fileName);
      } else {
         csvURL = window.URL.createObjectURL(csvData);
      }
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', fileName);
      tempLink.click();
   };

   const handleCsvExport = () => {
      exportToCsv(fetchedKeywords, 'keywords.csv');
   };


   // handle favourite click

   const handleFavouriteClick = (id) => {
      // get the item from the array
      const item = fetchedKeywords.find((item) => item.id === id);
      // check if the item is already favourited

      if (item.favourited) {
         // if it is already favourited
         // we remove it from the array
         // remove from favourites
         axios
            .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/favourites/remove', {
               keyword: item,
               email: session.token.email,
            })
            .then((res) => {
               if (res.status === 200) {
                  item.favourited = false;

                  const index = fetchedKeywords.findIndex((item) => item.id === id);
                  let temp = fetchedKeywords;
                  temp[index] = item;

                  setFetchedKeywords([...temp]);

                  setToastType('success');
                  setToastTitle('Success!');
                  setToastMessage(res.data.message);
                  setToast(true);
                  // after 3sconds set toast to false (hidden)
                  setTimeout(() => {
                     setToast(false);
                  }, 3000);
               }
            })
            .catch((err) => {
               if (err.response) {
                  setToastType('danger');
                  setToastTitle('Error!');
                  setToastMessage(err.response.data.message);
                  setToast(true);
                  setIsLoading(false);

                  // after 3sconds set toast to false (hidden)
                  setTimeout(() => {
                     setToast(false);
                  }, 3000);
               }
            });
         return true;
      }

      // if it is not favourited
      // we set the item to favourited
      item.favourited = true;
      // we search for the item in state and set it to favourited
      const index = fetchedKeywords.findIndex((item) => item.id === id);
      let temp = fetchedKeywords;
      temp[index] = item;

      // we set the state to the new array with the favourited keyword
      setFetchedKeywords([...temp]);

      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/favourites/create',
            { keyword: item },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               setToastType('success');
               setToastTitle('Success!');
               setToastMessage(res.data.message);
               setToast(true);
               // after 3sconds set toast to false (hidden)
               setTimeout(() => {
                  setToast(false);
               }, 3000);
            }
         })
         .catch((err) => {
            if (err.response) {
               setToastType('danger');
               setToastTitle('Error!');
               setToastMessage(err.response.data.message);
               setToast(true);
               setIsLoading(false);

               // after 3sconds set toast to false (hidden)
               setTimeout(() => {
                  setToast(false);
               }, 3000);
            }
         });
   };

   // function that takes a double and show it with 2 decimals
   const showDouble = (double) => {
      return double.toFixed(2);
   };
   //function that generate a random number between 0 and 35
   const randomNumber = () => {
      return Math.floor(Math.random() * 35);
   };

   return (
      <DashLayout>
                           <NextSeo title={"Keyword Suggestion tool"} description={"Main tool for keyword research tool."} />
         <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7 p-2  flex-col space-y-5">
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Keyword Research</h1>
            </div>
            {/* Keyword search component */}
            <KeywordSearch
               isLoading={isLoading}
               handleKeywordLookupSubmit={handleKeywordLookupSubmit}
            />
            {/* Result Head */}

            <div className="  flex md:flex-row flex-col w-full mt-4 gap-10">
               {/* Difficulty circle progress bar */}
               <div className="bg-white md:w-96  w-full h-56 flex flex-col justify-start items-center border border-border-color-light ">
                  {/* difficulty top */}
                  <div className="flex px-4 py-2 w-full">
                     <Tooltip
                        className="ml-auto"
                        title="difficulty of ranking in the first top-10 organic results for a keyword
                                                                indicates the chance of getting in top-10 organic results for a keyword on a logarithmic scale from 0 to 100">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <ResponsiveContainer width="50%" height="30%">
                     <RadialBarChart
                        startAngle={0}
                        cx="50%"
                        cy="50%"
                        innerRadius="80%"
                        outerRadius="80%"
                        barSize={17}
                        data={data}>
                        <RadialBar minAngle={15} background clockWise dataKey="uv" />
                     </RadialBarChart>
                  </ResponsiveContainer>
                  {/* Difficulty tyoe */}
                  {fetchedKeywords.length > 0 && (
                     <div className="flex flex-col text-center">
                        <span className="text-xl font-bold">
                           {selectedDifficulty}
                           <span className="font-normal text-xs">/100</span>{' '}
                        </span>
                        <span className="font-semibold">
                           {selectedDifficulty > 80
                              ? 'VERY HARD'
                              : selectedDifficulty > 60
                              ? 'HARD'
                              : selectedDifficulty > 40
                              ? 'POSSIBLE '
                              : selectedDifficulty > 20
                              ? 'STILL EASY'
                              : 'VERY EASY'}
                        </span>
                        <span className="text-sm text-title-color-muted">Keyword Difficulty</span>
                     </div>
                  )}
               </div>

               <div className="bg-white flex-grow h-56 w-full  flex border border-border-color-light ">
                  {/* Search History */}
                  {fetchedKeywords.length > 0 ? (
                     <SearchHistory
                        type="lookup"
                        data={
                           fetchedKeywords.length > 0
                              ? fetchedKeywords[currentHistoryPos].monthly
                              : fetchedKeywords
                        }
                     />
                  ) : (
                     <div className="flex  w-full md:m-4 m-0  border-2 rounded-md p-2 ">
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>

                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>

                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>

                        <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                           <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Table of keywords returned */}
            <div className="  w-full bg-white p-5 border border-border-color-light ">
               <div className="flex items-center pb-4 ">
                  <h3 className="text-base text-title-color-muted font-semibold m-0 p-0">Result</h3>
                  {/* Search form */}
                  <form
                     className="mx-10 h-full flex items-center "
                     onSubmit={handleSubmit(onKeywordSearch)}>
                     <input
                        {...register('keywordPhrase')}
                        placeholder="Search for keyword "
                        className="border rounded-tl-md rounded-bl-md outline-none py-1 text-sm pl-3 border-r-0 h-full"
                        {...register('searchPhrase')}
                     />
                     <button className="border rounded-tr-md rounded-br-md border-l-0 text-xl m-0 hover:bg-gray-50 cursor-pointer py-1 h-full w-[40px] flex justify-center items-center">
                        <AiOutlineSearch />
                     </button>
                  </form>
                  {/* End of search form */}
                  {/* End of search form */}
                  {fetchedKeywords && fetchedKeywords.length > 0 && (
                     <button
                        onClick={() => handleCsvExport()}
                        className={`flex items-center bg-[#24263A] text-white px-4 py-2 rounded-md`}>
                        {' '}
                        <AiOutlineCloudDownload className="mr-2 " />{' '}
                        <span className="text-xs font-semibold">Export</span>
                     </button>
                  )}
               </div>
               <div className="w-full overflow-x-scroll">
                  <table className="table-auto  w-full     ">
                     <thead className="bg-table-head-bg">
                        <tr className=" font-semibold text-gray-600 ">
                           {/* <th className="px-4 py-2 font-semibold text-left ">Select</th> */}

                           <th className="px-4 py-2 font-normal  text-left  text-sm">Keyword</th>
                           <th className="px-4 py-2 font-normal  text-sm">Volume</th>
                           {/* <th className="px-4 py-2 font-normal  text-sm">Competition</th> */}
                           <th className="px-4 py-2 font-normal  text-sm">Difficulty</th>
                           <th className="px-4 py-2 font-normal  text-sm">CPC</th>
                        </tr>
                     </thead>
                     <tbody className="w-full   ">
                        {fetchedKeywords.length > 0 &&
                           // show only 1 lookup per page

                           paginate(
                              searchResult.length == 0 ? fetchedKeywords : searchResult,
                              20,
                              searchResult.length == 0 ? lastLookupPage : 1
                           ).map((lookup, index) => (
                              <tr
                                 onClick={() => {
                                    getIndex(lookup.keyword);
                                    setSelectedDifficulty(lookup.difficulty);
                                 }}
                                 key={index}
                                 className="text-sm cursor-pointer border-b bg-gray-50 hover:bg-gray-50 font-semibold ">
                                 {/* check box input */}
                                 {/* <td className=" px-4 py-4">
                                            <input onChange={() => handleCheckboxClick(lookup)} type="checkbox" checked={lookup.selected} className="form-checkbox" />
                                        </td> */}
                                 <td className=" px-4 py-4 flex items-center min-w-[300px]">
                                    {/* Set as favourite */}
                                    <BsFillStarFill
                                       onClick={() => handleFavouriteClick(lookup.id)}
                                       className={`mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer ${
                                          lookup.favourited ? 'text-[#FFCC77]' : ''
                                       }`}
                                    />
                                    {lookup.keyword}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {lookup.volume.search_volume}
                                 </td>
                                 {/* <td className=" px-4 py-4 text-center">{lookup.competition}</td> */}
                                 <td className=" px-4 py-4 text-center flex justify-center">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-10 h-4 rounded-md flex text-xs text-white items-center justify-center  ${
                                          lookup.difficulty >= 80
                                             ? 'bg-[#e74c3c]'
                                             : lookup.difficulty >= 60
                                             ? 'bg-[#f1530f]'
                                             : lookup.difficulty >= 40
                                             ? 'bg-[#f1c40f]'
                                             : lookup.difficulty >= 20
                                             ? 'bg-[#2ecc71]'
                                             : lookup.difficulty > 0
                                             ? 'bg-[#2ecc71]'
                                             : lookup.difficulty == undefined
                                             ? 'bg-[#2ecc71]'
                                             : ''
                                       } `}>
                                       {lookup.difficulty}
                                    </div>
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {lookup.cpc ? showDouble(lookup.cpc) : 'N'}
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               {/* Placeholder if no search has been done */}

               {fetchedKeywords.length == 0 && (
                  <div className="flex flex-col border-2 rounded-md p-2 mt-4">
                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>

                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>
                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>
                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>
                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>
                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>

                     <div className="w-full flex flex-col items-stretch">
                        <div className="w-full animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md"></div>
                     </div>
                  </div>
               )}

               {/* Pagingation */}
               {fetchedKeywords.length > 0 && (
                  <div className="flex items-center my-4">
                     <button
                        onClick={() => handlePreviousPage()}
                        className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 ">
                        Previous
                     </button>
                     <span className="mx-2">{lastLookupPage}</span>
                     <button
                        onClick={() => handleNextPage()}
                        className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2">
                        Next
                     </button>
                     <span className="text-xs text-title-color-muted ml-3">
                        {fetchedKeywords.length} results.
                     </span>
                  </div>
               )}
            </div>
         </div>
      </DashLayout>
   );
}

const mapStateToProps = (state) => {
   return {
      keyword: state.keywordSearch.keyword,
      result: state.keywordSearch.result,
      difficulty: state.keywordSearch.difficulty,
      search_volume_history: state.keywordSearch.search_volume_history,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setKeyword: (keyword) => dispatch(searchActions.setKeyword(keyword)),
      setResult: (result) => dispatch(searchActions.setResult(result)),
      setDifficulty: (difficulty) => dispatch(searchActions.setDifficulty(difficulty)),
      setSearchVolumeHistory: (search_volume_history) =>
         dispatch(searchActions.setSearchVolumeHistory(search_volume_history)),
      setToast: (toast) => dispatch(setToast(toast)),
      setToastTitle: (toastTitle) => dispatch(setToastTitle(toastTitle)),
      setToastMessage: (toastMessage) => dispatch(setToastMessage(toastMessage)),
      setToastType: (toastType) => dispatch(setToastType(toastType)),
   };
};

export async function getServerSideProps(context) {
   const session = await getSession(context);

   if (!session) {
      return {
         redirect: {
            destination: '/login',
            permanent: false,
         },
      };
   }

   return {
      props: { session },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Lookup);
