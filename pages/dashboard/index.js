import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import DashLayout from '../../Layouts/dashLayout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import {
   addSelectedKeyword,
   removeSelectedKeyword,
   clearSelectedKeywords,
} from '../../redux/actions/selectedKeywordsActions';
import {
   setLookupSeleted,
   setLookupUnSelected,
   deleteLookup,
} from '../../redux/actions/lastLookupsActions';
import { paginate, checkStringLength } from '../../utils';
import { BiTrash } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';
import { setUserVerified, setNotifications } from '../../redux/actions/initsActions';
import { setLookups } from '../../redux/actions/lastLookupsActions';
import {
   setToast,
   setToastMessage,
   setToastTitle,
   setToastType,
} from '../../redux/actions/initsActions';
import { NextSeo } from 'next-seo';
function Dashboard({
   clearSelectedKeywords,
   setToast,
   setToastMessage,
   setToastTitle,
   setToastType,
   selectedKeywords,
   addSelectedKeyword,
   removeSelectedKeyword,
   lastLookups,
   setLookupSeleted,
   setLookupUnSelected,
   deleteLookup,
   isUserVerified,
   keywordSearched,
   keywordsReturned,
   setLookups,
   favourites,
   setNotifications,
}) {
   // state hold the page number of the last lookups table
   const [lastLookupPage, setLastLookupPage] = React.useState(1);
   // array that hold the lookups on search result
   const [searchResult, setSearchResult] = React.useState([]);

   const router = useRouter();
   const { data: session } = useSession();

   // handle verification resened click
   //   console.log(session);

   const handleVerificationResend = () => {
      // send a post request to '/api/user/verify'
      // and handle the response
      // if the response is ok alert that the message has been sent
      // if the response is not ok alert that the message has not been sent
      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/user/resend', {
            email: session.token.email,
         })
         .then((response) => {
            if (response.status === 200) {
               setToastType('success');
               setToastTitle('Success!');
               setToastMessage('Verification message has been sent');
               setToast(true);
               // after 3sconds set toast to false (hidden)
               setTimeout(() => {
                  setToast(false);
               }, 3000);
            }
         })
         .catch((error) => {
            setToastType('danger');
            setToastTitle('Error!');
            setToastMessage('Verification message has not been sent');
            setToast(true);
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
               setToast(false);
            }, 3000);
         });
   };

   // form hook
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   // handle keyword  search form submit using react hook form
   const onKeywordSearch = (data) => {
      console.log(data);
      // check if there is any lookup that contains the keyphrase
      const lookups = lastLookups.filter((lookup) =>
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
         setToastType('danger');
         setToastTitle('No lookups!');
         setToastMessage('No lookups found');
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
   // function that adds coma to big numbers
   function addComma(num) {
      if (num !== undefined && num !== null)
         return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   }

   // on click of checkbox, add keyword using addSelectedKeyword action
   function handleCheckboxClick(keyword) {
      if (keyword.selected) {
         removeSelectedKeyword(keyword);
         setLookupUnSelected(keyword);
      } else {
         addSelectedKeyword(keyword);
         setLookupSeleted(keyword);
      }
   }

   // handle next page of last lookups
   function handleNextPage() {
      if (lastLookupPage < lastLookups.length / 5) {
         setLastLookupPage(lastLookupPage + 1);
      }
   }
   // handle previous page of last lookups
   function handlePreviousPage() {
      if (lastLookupPage > 1) {
         setLastLookupPage(lastLookupPage - 1);
      }
   }

   // handle delete lookup
   function handleDeleteLookup() {
      // get the selected keywords and delete them one by one
      const selectedKeywords = lastLookups.filter((lookup) => lookup.selected);
      selectedKeywords.forEach((lookup) => {
         deleteLookup(lookup);
      });
      // clear the selectedkeywords array
      clearSelectedKeywords();
   }

   // const cards = [
   //    {
   //       title: 'Keywords Search',
   //       description: 'Number of lookups',
   //       value: keywordSearched,
   //       icon: <LookupSvg className="w-8 h-8" />,
   //    },
   //    {
   //       title: 'Keywords fetched',
   //       description: 'Keyword returned by the API',
   //       value: keywordsReturned,
   //       icon: <KeywordsSvg className="w-8 h-8" />,
   //    },
   //    {
   //       title: 'On-page Lookups',
   //       description: 'Number of lookups left',
   //       value: '0',
   //       icon: <KeywordsLeft className="w-8 h-8" />,
   //    },
   //    {
   //       title: 'Favourites',
   //       description: 'Number of favourites',
   //       value: favourites,
   //       icon: <FavouritesSvg className="w-8 h-8" />,
   //    },
   // ];
   // convert date from date to dd-mm-yyyy
   const convertDate = (date) => {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let convertedDate = `${day}-${month}-${year}`;
      return convertedDate;
   };

   // load last lookups history function
   const loadLastLookups = () => {
      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/lookups/last')
         .then((response) => {
            if (response.status === 200) {
               setLookups(response.data.history);
            }
         })
         .catch((error) => {
            setToastType('danger');
            setToastTitle('Error!');
            setToastMessage('Failed to load last lookups');
            setToast(true);
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
               setToast(false);
            }, 3000);
         });
   };

   React.useEffect(async () => {
      loadLastLookups();
      getLastNotifications();

      // toast
      // setToastType('danger');
      // setToastTitle('Error!');
      // setToastMessage('Verification message has not been sent');
      // setToast(true);
      //toast end
      /// check for subscription
      await axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/user/subscription/check',
            {},
            {
               withCredentials: true,
            }
         )
         .then((response) => {
            if (response.status === 200) {
               if (response.data) {
                  console.log(response.data);
               }
            }
         })
         .catch((error) => {});
   }, []);

   // function that gets last notifications
   const getLastNotifications = () => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/notifications/getlast',
            {},
            { withCredentials: true }
         )
         .then((res) => {
            setNotifications(res.data.notifications);
         });
   };

   return (
      <DashLayout>
         <NextSeo
            title={'Dashboard'}
            description={'Main dashboard for the keyword research tool.'}
         />

         <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7  flex-col">
            {/* Alert Verification*/}

            {!isUserVerified && (
               <div className="px-4">
                  <div
                     className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                     role="alert">
                     <p className="font-bold">Account verification</p>
                     <p>
                        To use all features you need to verify your account,{' '}
                        <a
                           onClick={() => {
                              handleVerificationResend();
                           }}
                           className="font-bold cursor-pointer text-xs">
                           {' '}
                           Send again
                        </a>{' '}
                     </p>
                  </div>
               </div>
            )}

            {/* Cards */}
            <div className="flex w-full  flex-wrap ">
               <div className="md:w-1/3 p-4 md:h-[200px] w-1/2 ">
                  <div className="bg-white border-border-color-light border rounded-lg p-4 h-full">
                     <div className="flex flex-row items-center">
                        <div className="flex-grow flex flex-col space-y-4">
                           <div className="flex justify-between">
                              <h3 className="text-base  font-semibold  text-title-color-muted">
                                 Keywords Search
                              </h3>
                              <p className="text-sm">
                                 <img
                                    src="/assets/Images/lookup.svg"
                                    className="w-8 h-8"
                                    alt="ss"
                                 />
                              </p>
                           </div>
                           <p className="text-3xl font-bold  text-text-primary-color">
                              {addComma(keywordSearched)}
                           </p>
                           <p className="text-xs text-text-primary-color">Number of lookups</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="md:w-1/3 p-4 md:h-[200px] w-1/2 ">
                  <div className="bg-white border-border-color-light border rounded-lg p-4 h-full">
                     <div className="flex flex-row items-center">
                        <div className="flex-grow flex flex-col space-y-4">
                           <div className="flex justify-between">
                              <h3 className="text-base  font-semibold  text-title-color-muted">
                                 Keywords fetched
                              </h3>
                              <p className="text-sm">
                                 <img
                                    src="/assets/Images/keywords.svg"
                                    className="w-8 h-8"
                                    alt="ss"
                                 />
                              </p>
                           </div>
                           <p className="text-3xl font-bold  text-text-primary-color">
                              {addComma(keywordsReturned)}
                           </p>
                           <p className="text-xs text-text-primary-color">
                              Keyword returned by the API
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               {/* <div className="md:w-1/4 p-4 md:h-[200px] w-1/2 ">
                  <div className="bg-white border-border-color-light border rounded-lg p-4 h-full">
                     <div className="flex flex-row items-center">
                        <div className="flex-grow flex flex-col space-y-4">
                           <div className="flex justify-between">
                              <h3 className="text-base  font-semibold  text-title-color-muted">
                                 On-page Lookups{' '}
                              </h3>
                              <p className="text-sm">
                                 {' '}
                                 <img
                                    src="/assets/Images/keywords-left.svg"
                                    className="w-8 h-8"
                                    alt="ss"
                                 />
                              </p>
                           </div>
                           <p className="text-3xl font-bold  text-text-primary-color">
                              {addComma(0)}
                           </p>
                           <p className="text-xs text-text-primary-color">
                              Number of lookups left
                           </p>
                        </div>
                     </div>
                  </div>
               </div> */}
               <div className="md:w-1/3 p-4 md:h-[200px] w-1/2 ">
                  <div className="bg-white border-border-color-light border rounded-lg p-4 h-full">
                     <div className="flex flex-row items-center">
                        <div className="flex-grow flex flex-col space-y-4">
                           <div className="flex justify-between">
                              <h3 className="text-base  font-semibold  text-title-color-muted">
                                 Favourites{' '}
                              </h3>
                              <p className="text-sm">
                                 <img
                                    src="/assets/Images/favourites.svg"
                                    className="w-8 h-8"
                                    alt="ss"
                                 />
                              </p>
                           </div>
                           <p className="text-3xl font-bold  text-text-primary-color">
                              {addComma(favourites)}
                           </p>
                           <p className="text-xs text-text-primary-color">Number of favourites </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Create am html table with the last lookups variable */}
            <div className="flex flex-col  bg-white p-7 mx-4 rounded-lg overflow-x-hidden  ">
               <div className="flex md:items-center items-start md:space-y-0 space-y-2 pb-4 md:flex-row flex-col ">
                  <h3 className="md:text-base text-xs text-title-color-muted font-semibold m-0 p-0">
                     Last lookups
                  </h3>
                  {/* Search form */}
                  <form
                     className="md:mx-10  flex h-[30px]  items-center "
                     onSubmit={handleSubmit(onKeywordSearch)}>
                     <input
                        {...register('keywordPhrase')}
                        placeholder="Search for keyword "
                        className="border rounded-tl-md rounded-bl-md outline-none  text-sm pl-3 border-r-0 h-full"
                        {...register('searchPhrase')}
                     />
                     <button className="border rounded-tr-md rounded-br-md border-l-0 text-xl m-0 hover:bg-gray-50 cursor-pointer h-full  flex justify-center items-center">
                        <AiOutlineSearch className="h-full  mr-1 " />
                     </button>
                  </form>
                  {/* End of search form */}
                  {/* Delete Button */}
                  {/* <button
                     onClick={() => handleDeleteLookup()}
                     className={`flex items-center ${
                        selectedKeywords.length > 0
                           ? 'bg-[#24263A] text-white'
                           : 'bg-gray-100 text-gray-500'
                     }  px-4 py-2 rounded-md`}
                  >
                     {' '}
                     <BiTrash className="mr-2 " />{' '}
                     <span className="text-xs font-semibold">Delete</span>
                  </button> */}
               </div>
               {/* Table */}
               <div className=" overflow-x-scroll w-full">
                  <table className="table-auto bg-table-head-bg  w-full   ">
                     <thead className="bg-table-head-bg w-full ">
                        <tr className=" text-gray-600 w-full  md:text-base text-xs">
                           <th className="px-4 py-2 font-normal  text-left ">Keyword</th>
                           <th className="px-4 py-2 font-normal">Date</th>
                           <th className="px-4 py-2 font-normal">Volume</th>

                           <th className="px-4 py-2 font-normal">Difficulty</th>
                           <th className="px-4 py-2 font-normal">CPC</th>
                        </tr>
                     </thead>
                     <tbody className="w-full ">
                        {lastLookups.length > 0 &&
                           // show only 1 lookup per page

                           paginate(
                              searchResult.length == 0 ? lastLookups : searchResult,
                              10,
                              searchResult.length == 0 ? lastLookupPage : 1
                           ).map((lookup, index) => (
                              <tr
                                 key={index}
                                 className="md:text-sm text-xs border-b bg-gray-50 hover:bg-gray-50 font-semibold ">
                                 {/* check box input */}

                                 <td className=" px-4 py-4 flex items-center md:min-w-[300px] min-w-[150px]">
                                    {/* Set as favourite */}
                                    {/* <BsFillStarFill className="mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer" /> */}
                                    {checkStringLength(lookup.keyword)}
                                 </td>
                                 <td className=" px-4 py-4 text-center md:min-w-[0px] min-w-[150px]">
                                    {convertDate(lookup.created_at)}
                                 </td>

                                 <td className=" px-4 py-4 text-center md:min-w-[0px] min-w-[150px]">
                                    {lookup.volume && lookup.volume.search_volume}
                                 </td>

                                 <td className=" px-4 py-4 text-center flex justify-center md:min-w-[200px] min-w-[150px]">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-10 h-4 rounded-lg flex text-white items-center justify-center  ${
                                          lookup.difficulty >= 80
                                             ? 'bg-[#e74c3c]'
                                             : lookup.difficulty >= 60
                                             ? 'bg-[#f1c40f]'
                                             : lookup.difficulty >= 40
                                             ? 'bg-[#2ecc71]'
                                             : lookup.difficulty >= 20
                                             ? 'bg-[#2ecc71]'
                                             : lookup.difficulty >= 0
                                             ? 'bg-[#2ecc71]'
                                             : ''
                                       } `}>
                                       {lookup.difficulty}
                                    </div>
                                 </td>
                                 <td className=" px-4 py-4 text-center md:min-w-[0px] min-w-[150px]">
                                    {lookup.cpc}
                                 </td>
                                 <td className=" px-4 py-4 text-center md:min-w-[0px] min-w-[150px]">
                                    {lookup.dailyImpression}
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               {/* Table end */}

               {/* Check if lastlookups is empty */}
               {lastLookups.length === 0 && (
                  <div className=" flex justify-center items-center  bg-white h-[300px] w-full flex-col">
                     <img src="/assets/Images/sad.svg" className="w-[100px] h-[100px]" alt="ss" />
                     <p className="text-center text-title-color-muted my-2  text-base">
                        No lookups found
                     </p>
                     <p className="text-center text-title-color-muted   text-xs">
                        (Data will be added as soon you make a search)
                     </p>
                  </div>
               )}

               {/* Pagingation */}
               {lastLookups.length > 0 && (
                  <div className="flex items-center my-4">
                     <button
                        onClick={() => handlePreviousPage()}
                        className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">
                        Previous
                     </button>
                     <button
                        onClick={() => handleNextPage()}
                        className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2">
                        Next
                     </button>
                     <span className="text-xs text-title-color-muted ml-3">
                        {lastLookups.length} results.
                     </span>
                  </div>
               )}
            </div>
         </div>
      </DashLayout>
   );
}

const mapStateToProps = (state) => ({
   selectedKeywords: state.selectedKeywords.selected_keywords,
   lastLookups: state.lastLookups.lookups,
   user_verified: state.inits.user_verified,
   email_verification: state.inits.email_verification,
});

const mapDispatchToProps = (dispatch) => ({
   addSelectedKeyword: (keyword) => dispatch(addSelectedKeyword(keyword)),
   removeSelectedKeyword: (keyword) => dispatch(removeSelectedKeyword(keyword)),
   setLookupSeleted: (lookup) => dispatch(setLookupSeleted(lookup)),
   setLookupUnSelected: (lookup) => dispatch(setLookupUnSelected(lookup)),
   deleteLookup: (lookup) => dispatch(deleteLookup(lookup)),
   clearSelectedKeywords: () => dispatch(clearSelectedKeywords()),
   setUserVerified: (verified) => dispatch(setUserVerified(verified)),
   setToast: (toast) => dispatch(setToast(toast)),
   setToastTitle: (toastTitle) => dispatch(setToastTitle(toastTitle)),
   setToastMessage: (toastMessage) => dispatch(setToastMessage(toastMessage)),
   setToastType: (toastType) => dispatch(setToastType(toastType)),
   setLookups: (lookups) => dispatch(setLookups(lookups)),
   setNotifications: (notifications) => dispatch(setNotifications(notifications)),
});

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

   let isUserVerified = false;

   console.log('im in');

   // chekck if user is verified
   await axios
      .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/user/isverified', {
         email: session.token.email,
      })
      .then((response) => {
         if (response.status === 200) {
            isUserVerified = true;
            console.log('verified');
         }
      })
      .catch((error) => {
         isUserVerified = false;
         console.log(error.message);
      });

   // get usage
   // get usage data
   let keywordSearched = 0;
   let keywordsReturned = 0;
   let favourites = 0;
   await axios
      .post(
         process.env.NEXT_PUBLIC_PROD_URL + '/api/usage/get',
         {},
         {
            withCredentials: true,

            headers: {
               Cookie: context.req.headers.cookie,
            },
         }
      )
      .then((res) => {
         console.log(res.data);
         keywordSearched = res.data.usage.keywordSearches;
         keywordsReturned = res.data.usage.keywordsReturned;
         favourites = res.data.usage.favourites;
      })
      .catch((err) => {
         console.log(err.message);
      });

   return {
      props: {
         session: session,
         isUserVerified: isUserVerified,
         keywordSearched: parseInt(keywordSearched),
         keywordsReturned: parseInt(keywordsReturned),
         favourites: parseInt(favourites),
      },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
