import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import ItemHistory from '../../../components/itemHistory';
import DashLayout from '../../../Layouts/dashLayout';
import { setHistory } from '../../../redux/actions/historyActions';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { getSession } from 'next-auth/react';
import SadIcon from '../../../public/assets/Images/sad.svg';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
function History({ history, setHistory }) {
   const [page, setPage] = React.useState(1);
   const [loading, setLoading] = React.useState(true);
   const [noDataReturned, setNoDataReturned] = React.useState(false);
   const router = useRouter()

   const keyword = {};

   // function that change string space to -
   function changeSpaceToDash(str) {
      return str.replace(/\s+/g, '-').toLowerCase();
   }

   // handle clk
   function handleClick(event) {
      event.preventDefault();
      router.push('/dashboard/lookup')


   }

   useEffect(() => {
      setLoading(true);
      axios
         .post( process.env.NEXT_PUBLIC_PROD_URL +
            '/api/operations/history',
            { page: page },
            { withCredentials: true }
         )
         .then((res) => {
            setLoading(false);
            if (res.data.history.length > 0) {
               setHistory(res.data.history);
            }
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
            setNoDataReturned(true);
         });
   }, [page]);

   function handleNextPage() {
      setPage(page + 1);
   }
   function handlePreviousPage() {
      // check if page is greater than 1
      if (page > 1) {
         setPage(page - 1);
      }
   }

   return (
      <DashLayout>
                           <NextSeo title={"Search History"} description={"Search History."} />

         <div className="bg-color-dashboard-bg flex flex-1 min-h-full w-full md:p-7 p-0  flex-col">
            {/* Head */}
            <div className="">
               <div className="flex items-center md:p-0 p-4 justify-between">
                  <h1 className="font-semibold text-3xl py-3">History</h1>

                  {/* <Link href={'/dashboard/lookup'}> */}
                  <button
                     onClick={(event) => handleClick(event)}
                     className={`flex items-center bg-[#24263A] text-white px-4 py-2 rounded-md h-10`}
                  >
                     {' '}
                     <AiOutlinePlusSquare className="mr-2 " />{' '}
                     <span className="text-xs font-semibold">Create new</span>
                  </button>
                  {/* </Link> */}
               </div>
            </div>
            {/* Table */}
            {loading ? (
               <div className="w-full h-full flex justify-center items-center">
                  <svg
                     role="status"
                     className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                     viewBox="0 0 100 101"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                     />
                     <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                     />
                  </svg>
               </div>
            ) : (
               <div className="w-full mx-auto mt-16">
                  {history.map((item, index) => {
                     return (
                        <Link
                           href={{
                              pathname:
                                 '/dashboard/history/' +
                                 changeSpaceToDash(item._id),
                           }}
                        >
                           <a>
                              <ItemHistory
                                 key={index}
                                 item={item}
                                 difficulty={item.difficulty}
                              />
                           </a>
                        </Link>
                     );
                  })}
               </div>
            )}
            {noDataReturned && (
               <div className="w-full h-full flex justify-center items-center bg-white rounded-md">
                  <div className="flex flex-col text-center">
                     <SadIcon className="w-[100px] h-[100px] mx-auto my-3" />
                     <span className="text-base font-semibold">
                        {' '}
                        No searches found{' '}
                     </span>
                     <p className="text-sm ">
                        History will show once you start making keyword searches
                     </p>
                  </div>
               </div>
            )}
            <div className="flex items-center md:p-0 p-4 my-4 mt-auto">
               <button
                  onClick={() => handlePreviousPage()}
                  className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2"
               >
                  Previous
               </button>
               <button className="bg-white text-sm mr-2 border-border-color-light border rounded-lg px-4 py-2">
                  {page}
               </button>

               <button
                  onClick={() => handleNextPage()}
                  className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2"
               >
                  Next
               </button>
            </div>
         </div>
      </DashLayout>
   );
}

const mapStateToProps = (state) => {
   return {
      history: state.history.history,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setHistory: (history) => dispatch(setHistory(history)),
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

export default connect(mapStateToProps, mapDispatchToProps)(History);
