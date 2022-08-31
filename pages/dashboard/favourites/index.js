import React from 'react';
import Image from 'next/image';

import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import DashLayout from '../../../Layouts/dashLayout';
import { paginate, checkStringLength } from '../../../utils';
import { BsFillStarFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import SadStar from '../../../public/assets/Images/sad.svg';
import { setFavourites } from '../../../redux/actions/favouritesActions';
import axios from 'axios';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { NextSeo } from 'next-seo';
import {
   setToast,
   setToastMessage,
   setToastTitle,
   setToastType,
} from '../../../redux/actions/initsActions';

function Favourites({
   favourites,
   setFavourites,
   setToast,
   setToastMessage,
   setToastTitle,
   setToastType,
}) {
   const [favouritesPage, setFavouritesPage] = React.useState(1);
   const [searchResult, setSearchResult] = React.useState([]);

   const { register, handleSubmit, errors } = useForm();

   // handle keyword  search form submit using react hook form
   const onKeywordSearch = (data) => {
      console.log(data);
      // check if there is any lookup that contains the keyphrase
      const lookups = favourites.filter((lookup) =>
         lookup.keyword.toLowerCase().includes(data.searchPhrase.toLowerCase())
      );

      // if there is any lookup that contains the keyphrase
      if (lookups.length > 0) {
         // set the search result to the lookups
         setSearchResult(lookups);
         // set the page number to 1
         setFavouritesPage(1);
      } else {
         // if there is no lookup that contains the keyphrase
         // set the search result to empty array
         setSearchResult([]);
         setToastType('danger');
         setToastTitle('No lookups!');
         setToastMessage('No lookups found for the search phrase');
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

   // handle next page of last lookups
   function handleNextPage() {
      if (favouritesPage < favourites.length / 5) {
         setFavouritesPage(favouritesPage + 1);
      }
   }
   // handle previous page of last lookups
   function handlePreviousPage() {
      if (favouritesPage > 1) {
         setFavouritesPage(favouritesPage - 1);
      }
   }

   //Load all favourites on use effect
   React.useEffect(() => {
      // get all favourites
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/favourites',
            {},
            { withCredentials: true }
         )
         .then((res) => {
            console.log(res.data.favourites);
            // set the favourites
            setFavourites(res.data.favourites);
         })
         .catch((err) => {
            console.log(err);
            setFavourites([]);
         });
   }, []);

   // handle favourite button click
   const handleFavouriteRemove = (id, keyword) => {
      console.log(id);

      // remove the favourite from the database

      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/favourites/remove',
            { keyword: keyword },
            { withCredentials: true }
         )
         .then((res) => {
            // remove the lookup from the favourites
            const newFavourites = favourites.filter((favourite) => favourite.id !== id);

            // set the new favourites
            setFavourites(newFavourites);

            setToastType('success');
            setToastTitle('Success!');
            setToastMessage('You have removed the lookup from your favourites');
            setToast(true);
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
               setToast(false);
            }, 3000);
         })
         .catch((err) => {
            console.log(err);

            setToastType('danger');
            setToastTitle('Error!');
            setToastMessage('Error while removing the favourite');
            setToast(true);
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
               setToast(false);
            }, 3000);
         });
   };

   // function export an array as csv
   const exportToCsv = (array, fileName) => {
      var csv = array.map((item) => {
         return (
            item.keyword +
            ',' +
            item.volume.search_volume +
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
      exportToCsv(favourites, 'favourites.csv');
   };

   return (
      <DashLayout>
                                    <NextSeo title={"Favourites"} description={"Favourite keywords."} />

         <div className="bg-color-dashboard-bg flex flex-1 w-full   min-h-screen md:p-7 p-2  flex-col">
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Favourites</h1>
               <p>In here you can access all you favourited items.</p>
            </div>
            {/* Table */}
            <div className="bg-white p-7 mt-4">
               <div className=" overflow-x-scroll scrollbar-hide w-full">
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
                           <AiOutlineSearch className="h-full  mr-1" />
                        </button>
                     </form>
                     {/* End of search form */}
                     {favourites && favourites.length > 0 && (
                        <button
                           onClick={() => handleCsvExport()}
                           className={`flex items-center bg-[#24263A] text-white px-4 py-2 rounded-md`}>
                           {' '}
                           <AiOutlineCloudDownload className="mr-2 " />{' '}
                           <span className="text-xs font-semibold">Export</span>
                        </button>
                     )}
                  </div>

                  <table className="table-auto  w-full  ">
                     <thead className="bg-table-head-bg">
                        <tr className=" font-semibold">
                           <th className="px-4 py-2 font-semibold  text-left">Keyword</th>
                           <th className="px-4 py-2 font-semibold">Volume</th>
                           <th className="px-4 py-2 font-semibold">Competition</th>
                           <th className="px-4 py-2 font-semibold">Difficulty</th>
                           <th className="px-4 py-2 font-semibold">CPC</th>
                        </tr>
                     </thead>
                     <tbody className="w-full ">
                        {favourites &&
                           favourites.length > 0 &&
                           // show only 1 lookup per page

                           paginate(
                              searchResult.length == 0 ? favourites : searchResult,
                              5,
                              searchResult.length == 0 ? favouritesPage : 1
                           ).map((favourite, index) => (
                              <tr
                                 key={index}
                                 className="text-sm border-b bg-gray-50 hover:bg-gray-50 font-semibold ">
                                 <td className=" px-4 py-4 flex items-center min-w-[300px]">
                                    {/* Set as favourite */}
                                    {/* <BsFillStarFill className="mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer" /> */}
                                    <BsFillStarFill
                                       onClick={() =>
                                          handleFavouriteRemove(favourite.id, favourite)
                                       }
                                       className={`mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer ${
                                          favourite.favourited ? 'text-[#FFCC77]' : ''
                                       }`}
                                    />

                                    {checkStringLength(favourite.keyword)}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {favourite.volume.search_volume}
                                 </td>
                                 <td className=" px-4 py-4 text-center">{favourite.competition}</td>
                                 <td className=" px-4 py-4 text-center flex justify-center">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-10 h-4 rounded-lg flex text-white items-center justify-center  ${
                                          favourite.difficulty >= 80
                                             ? 'bg-[#e74c3c]'
                                             : favourite.difficulty >= 60
                                             ? 'bg-[#f1c40f]'
                                             : favourite.difficulty >= 40
                                             ? 'bg-[#2ecc71]'
                                             : favourite.difficulty >= 20
                                             ? 'bg-[#2ecc71]'
                                             : favourite.difficulty >= 0
                                             ? 'bg-[#2ecc71]'
                                             : ''
                                       } `}>
                                       {favourite.difficulty}
                                    </div>
                                 </td>
                                 <td className=" px-4 py-4 text-center">{favourite.cpc}</td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               {/* Pagingation */}
               {favourites && favourites.length > 0 && (
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
                        {favourites.length} results.
                     </span>
                  </div>
               )}

               {favourites && favourites.length === 0 && (
                  <div className="flex flex-col  justify-center items-center h-48">
                     <img src="/assets/Images/sad.svg" className="w-20 h-20 " alt="ss" />
                     <span className="mt-4 text-xs ">No keyword has been favourited yet. </span>
                  </div>
               )}
            </div>

            {/* Table end */}
         </div>
      </DashLayout>
   );
}

const mapStateToProps = (state) => {
   return {
      favourites: state.favourites.favourites,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setFavourites: (favourites) => dispatch(setFavourites(favourites)),
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

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
