import React, { useEffect } from 'react';
import axios from 'axios';
import DashLayout from '../../../Layouts/dashLayout';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { checkStringLength } from '../../../utils';
import { getSession } from 'next-auth/react';
// icons
import { AiOutlineSearch } from 'react-icons/ai';
import { GrFormClose } from 'react-icons/gr';
import Image from 'next/image';
const Subscriptions = () => {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedKeywords, setSelectedKeywords] = React.useState([]);
   const [lastSubscriptions, setlastSubscriptions] = React.useState([]);
   const [lastSubscriptionsPage, setlastSubscriptionsPage] = React.useState(1);
   const [searchResult, setSearchResult] = React.useState([]);
   const [selectedSubscription, setSelectedSubscription] = React.useState('');
   const [selectedEnds, setSelectedEnds] = React.useState('');

   const [subscriptionsHistory, setSubscriptionsHistory] = React.useState([]);

   const [userEditModalVisible, setUserEditModalVisible] =
      React.useState(false);
   const [userEditModalSection, setUserEditModalSection] =
      React.useState('Account');
   const [totalSubscriptions, setTotalSubscriptions] = React.useState(0);

   const [selectedUser, setSelectedUser] = React.useState();

   const onKeywordSearch = (data) => {
      // check if searchPhrase is an email
      if (data.searchPhrase.includes('@')) {
         // search for email
         axios
            .post(
               process.env.NEXT_PUBLIC_PROD_URL +
                  `/api/admin/subscriptions/get/one`,
               { email: data.searchPhrase },
               { withCredentials: true }
            )
            .then((res) => {
               setSearchResult([...[res.data]]);
            })
            .catch((err) => {
               alert('Not found');
            });
      } else {
         alert('Please enter an email');
      }
   };

   useEffect(() => {
      getlastSubscriptions();
   }, [lastSubscriptionsPage]);

   // const handle tab click
   const handleTabClick = (tab) => {
      setUserEditModalSection(tab);
   };

   // handle modal submit
   const handleModalSubmit = (data) => {
      // if the user edit section is account
      if (userEditModalSection === 'Account') {
         // update the user account
         axios
            .post(
               process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/user/edit',
               {
                  email: data.email,
                  password: data.password,
                  status: data.status,
                  uid: selectedUser._id,
                  type: 'status',
               },
               { withCredentials: true }
            )
            .then((res) => {
               // if the user updated successfully
               if (res.status === 200) {
                  alert('User Updated Successfully');
                  // get the last users
                  getLastUsers();
                  // close the modal
                  setUserEditModalVisible(false);
               }
            })
            .catch((err) => {
               alert(err.data.error);
            });
      } else if (userEditModalSection === 'Subscription') {
         // before we send the subscription data to the server
         // we check if  membership and subscriptionEnds are valid
         if (data.membership === '') {
            alert('Please Select Membership');
            return;
         }
         if (data.subscriptionEnds === '') {
            alert('Please Select Subscription Ends');
            return;
         }

         // check a variable with regex to check if the string in this format dd-mm-yyyy
         const regex =
            /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
         // if the subscriptionEnds is not in the correct format
         if (!regex.test(data.subscriptionEnds)) {
            alert('Please Enter a Valid Date');
            return;
         }

         // update the user subscription
         // update the user account
         axios
            .post(
               process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/user/edit',
               {
                  membership: data.membership,
                  subscriptionEnds: data.subscriptionEnds,
                  uid: selectedUser._id,
                  type: 'subscription',
               },
               { withCredentials: true }
            )
            .then((res) => {
               // if the user updated successfully
               if (res.status === 200) {
                  alert('User Updated Successfully');
                  // get the last users
                  getLastUsers();
                  // close the modal
                  setUserEditModalVisible(false);
               }
            })
            .catch((err) => {
               alert(err.response.data.error);
            });
      } else if (userEditModalSection === 'Stats') {
         // update the user keywords
      }
   };

   // handle click on user ModalElement, if the user click outside of the modal, close the modal
   const handleUserEditModalClick = (e) => {
      if (e.target.id === 'userEditModal') {
         setUserEditModalVisible(false);
      }
   };
   // function that get users from database

   const getlastSubscriptions = async () => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/subscriptions/get',
            {
               page: lastSubscriptionsPage,
            },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               if (res.data.subscriptions.length > 0) {
                  setlastSubscriptions([...res.data.subscriptions]);
                  setTotalSubscriptions(res.data.totalSubscriptions);
               }
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const openModal = async (user) => {
      setUserEditModalVisible(true);
      setSelectedUser(user);
      await getSubscriptionsHistory(user.uid);
   };

   // handle next page
   const handleNextPage = () => {
      let page = lastSubscriptionsPage + 1;
      setlastSubscriptionsPage(page);
      setSearchResult([]);
   };
   // handle previous page
   const handlePreviousPage = () => {
      if (lastSubscriptionsPage > 1) {
         setSearchResult([]);

         setlastSubscriptionsPage(lastSubscriptionsPage - 1);
      }
   };

   // function that get subscriptions history of a user
   const getSubscriptionsHistory = async (id) => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/user/subscription/getall',
            { userId: id },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               setSubscriptionsHistory(res.data.subscriptions);
               console.log('subscriptions history', res.data.subscriptions);
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };
   // convert date from date to dd-mm-yyyy
   const convertDate = (date) => {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let convertedDate = `${day}-${month}-${year}`;
      return convertedDate;
   };

   return (
      <DashLayout>
         <div className="bg-color-dashboard-bg flex flex-1 w-full h-full md:p-7 p-2  flex-col relative">
            {/* Modal */}
            <AnimatePresence>
               {userEditModalVisible && (
                  <motion.div
                     id="userEditModal"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={handleUserEditModalClick}
                     className="absolute top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:w-[40%] w-[90%] h-[70%] bg-white rounded-xl shadow-md flex flex-col py-4 px-8 overflow-x-hidden ">
                        {/* Modal head */}
                        <div className="flex h-10 justify-between w-full my-3">
                           <span className="font-semibold md:text-lg text-base">
                              Subscriptions
                           </span>
                           <div className=" group hover:bg-gray-100  w-8 cursor-pointer h-8 bg-gray-50 flex justify-center items-center">
                              <GrFormClose className="md:text-3xl text-xl" />
                           </div>
                        </div>

                        {/* Modal body */}
                        {/* Account section */}

                        <div className="flex flex-col">
                           <form
                              onSubmit={handleSubmit(handleModalSubmit)}
                              className="flex flex-col h-full">
                              <div className="flex flex-col mt-3">
                                 <label
                                    htmlFor="status"
                                    className="text-sm text-gray-500">
                                    Subscription
                                 </label>
                                 <div className="flex flex-col">
                                    <select
                                       {...register('membership')}
                                       id="status"
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold">
                                       <option>{selectedUser.plan}</option>
                                    </select>
                                 </div>
                              </div>
                              {/* Subscription ends use the same styles of the inpute above and create a simple date picker */}
                              <div className="flex flex-col mt-3">
                                 <label
                                    htmlFor="email"
                                    className="text-sm text-gray-500">
                                    Subscription ends
                                 </label>
                                 <input
                                    className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                    type="text"
                                    id="email"
                                    value={selectedUser.ends}
                                    {...register('subscriptionEnds')}
                                 />
                              </div>

                              {/* use the same style above to render a list with subscription history, from to  */}
                              <div className="flex flex-col mt-3">
                                 <label
                                    htmlFor="email"
                                    className="text-sm text-gray-500">
                                    Subscription history
                                 </label>
                                 <div className="flex flex-col">
                                    <ul className="flex flex-col my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold">
                                       <li className="flex space-x-2 "></li>

                                       {subscriptionsHistory &&
                                          subscriptionsHistory.map(
                                             (subscription) => (
                                                <li
                                                   className="flex space-x-2 "
                                                   key={subscription.id}>
                                                   <span className="text-sm ">
                                                      {convertDate(
                                                         subscription.start
                                                      )}
                                                   </span>
                                                   <span className="text-sm ">
                                                      {convertDate(
                                                         subscription.ends
                                                      )}
                                                   </span>
                                                </li>
                                             )
                                          )}
                                    </ul>
                                 </div>
                              </div>

                              <input
                                 type="submit"
                                 className=" mt-4 py-2 px-4 rounded-lg text-sm font-semibold text-white w-fit bg-[#413EF7]"
                                 value="Submit"
                              />
                           </form>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Subscriptions</h1>
            </div>
            {/* Body */}

            {/* Create am html table with the last members */}
            <div className="flex flex-col  bg-white p-7 mt-10 mx-4 rounded-lg overflow-x-hidden  ">
               <div className="flex md:items-center items-start md:space-y-0 space-y-2 pb-4 md:flex-row flex-col ">
                  <h3 className="md:text-base text-xs text-title-color-muted font-semibold m-0 p-0">
                     Last Users
                  </h3>
                  {/* Search form */}
                  <form
                     className="md:mx-10  flex h-[30px]  items-center "
                     onSubmit={handleSubmit(onKeywordSearch)}>
                     <input
                        {...register('keywordPhrase')}
                        placeholder="Search for a user "
                        className="border rounded-tl-md rounded-bl-md outline-none  text-sm pl-3 border-r-0 h-full"
                        {...register('searchPhrase')}
                     />
                     <button className="border rounded-tr-md rounded-br-md border-l-0 text-xl m-0 hover:bg-gray-50 cursor-pointer h-full  flex justify-center items-center">
                        <AiOutlineSearch className="h-full  mr-1 " />
                     </button>
                  </form>
                  {/* End of search form */}
               </div>
               {/* Table */}
               <div className=" overflow-x-scroll w-full">
                  <table className="table-auto  w-full o  ">
                     <thead className="bg-table-head-bg ">
                        <tr className=" font-semibold  md:text-base text-xs">
                           <th className="px-4 py-2 font-semibold text-left ">
                              Select
                           </th>

                           <th className="px-4 py-2 font-semibold  text-left">
                              _id
                           </th>
                           <th className="px-4 py-2 font-semibold">Email</th>
                           <th className="px-4 py-2 font-semibold">Start</th>
                           <th className="px-4 py-2 font-semibold">End</th>
                           <th className="px-4 py-2 font-semibold">Method</th>
                           <th className="px-4 py-2 font-semibold">Plan</th>
                        </tr>
                     </thead>
                     <tbody className="w-full ">
                        {lastSubscriptions.length > 0 &&
                           // show only 1 lookup per page

                           (searchResult.length == 0
                              ? lastSubscriptions
                              : searchResult
                           ).map((member, index) => (
                              <tr
                                 key={index}
                                 onClick={() => openModal(member)}
                                 className="md:text-sm text-xs border-b bg-gray-50 hover:bg-gray-100 cursor-pointer font-semibold ">
                                 {/* check box input */}
                                 <td className=" px-4 py-4">
                                    <input
                                       onChange={() =>
                                          handleCheckboxClick(member)
                                       }
                                       type="checkbox"
                                       checked={member.selected}
                                       className="form-checkbox"
                                    />
                                 </td>
                                 <td className=" px-4 py-4 flex items-center  ">
                                    {/* Set as favourite */}
                                    {checkStringLength(member._id)}
                                 </td>
                                 <td className=" px-4 py-4 md:min-w-[300px] text-center">
                                    {member.email}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {convertDate(member.start)}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {convertDate(member.ends)}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {member.method}
                                 </td>
                                 <td className=" px-4 py-4 text-center flex justify-center">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-14 h-4 rounded-lg flex min-w-[100px]  items-center justify-center `}>
                                       {
                                          // show date as dd/mm/yyyy
                                          member.plan
                                       }
                                    </div>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               {/* Table end */}

               {/* Check if lastSubscriptions is empty */}
               {lastSubscriptions.length === 0 && (
                  <div className=" flex justify-center items-center  bg-white h-[300px] w-full flex-col">
                     <p className="text-center text-title-color-muted my-2  text-base">
                        No Subscriptions found
                     </p>
                     <p className="text-center text-title-color-muted   text-xs">
                        (Data will be added as soon you make a search)
                     </p>
                  </div>
               )}

               {/* Pagingation */}
               {lastSubscriptions.length > 0 && (
                  <div className="flex items-center my-4">
                     <button
                        onClick={() => handlePreviousPage()}
                        className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">
                        Previous
                     </button>
                     <button className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">
                        {lastSubscriptionsPage}
                     </button>

                     <button
                        onClick={() => handleNextPage()}
                        className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2">
                        Next
                     </button>
                     <span className="text-sm ml-3">
                        {totalSubscriptions} Subscriptions
                     </span>
                  </div>
               )}
            </div>
         </div>
      </DashLayout>
   );
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
   if (session.token.role !== 'admin') {
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

export default Subscriptions;
