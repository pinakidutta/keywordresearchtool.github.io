import React, { useEffect } from 'react';
import axios from 'axios';
import DashLayout from '../../../Layouts/dashLayout';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { checkStringLength } from '../../../utils';

// icons
import { AiOutlineSearch } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { GrFormClose } from 'react-icons/gr';
import { getSession } from 'next-auth/react';
import Image from 'next/image';

const Members = () => {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedKeywords, setSelectedKeywords] = React.useState([]);
   const [lastMembers, setLastMembers] = React.useState([]);
   const [lastLookupPage, setLastLookupPage] = React.useState(1);
   const [searchResult, setSearchResult] = React.useState([]);
   const [subscriptionsHistory, setSubscriptionsHistory] = React.useState([]);

   const [userEditModalVisible, setUserEditModalVisible] =
      React.useState(false);
   const [userEditModalSection, setUserEditModalSection] =
      React.useState('Account');

   const [selectedUser, setSelectedUser] = React.useState();

   const onKeywordSearch = () => {};

   useEffect(() => {
      getLastMembers();
   }, [lastLookupPage]);

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

         // check a variable with regex to check if the string in this format mm/dd/yyyy
         const dateRegex =
            /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
         // if the membership and subscriptionEnds are valid
         if (!dateRegex.test(data.subscriptionEnds)) {
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
            .catch((err) => {});
      } else if (userEditModalSection === 'Stats') {
         // update the user keywords
      } else if (userEditModalSection === 'Notifications') {
         // update the user notifications history
         let notificationTitle = data.notificationTitle;
         let notificationMessage = data.notificationMessage;

         axios
            .post(
               process.env.NEXT_PUBLIC_PROD_URL +
                  '/api/admin/user/notification',
               {
                  notificationTitle: notificationTitle,
                  notificationMessage: notificationMessage,
               },
               { withCredentials: true }
            )
            .then((res) => {
               if (res.status === 200) {
                  alert('Notification Sent Successfully');
                  setUserEditModalVisible(false);
               }
            })
            .catch((err) => {
               alert(err.response.data.error);
            });
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

   // handle click on user ModalElement, if the user click outside of the modal, close the modal
   const handleUserEditModalClick = (e) => {
      if (e.target.id === 'userEditModal') {
         setUserEditModalVisible(false);
      }
   };
   // function that get users from database
   const getLastMembers = async () => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/users/get',
            {
               page: lastLookupPage,
            },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               if (res.data.length > 0) {
                  setLastMembers([...res.data]);
               }
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const openModal = (user) => {
      setUserEditModalVisible(true);
      setSelectedUser(user);
      getSubscriptionsHistory(user._id);
   };

   // handle next page
   const handleNextPage = () => {
      let page = lastLookupPage + 1;
      setLastLookupPage(page);
   };
   // handle previous page
   const handlePreviousPage = () => {
      if (lastLookupPage > 1) {
         setLastLookupPage(lastLookupPage - 1);
      }
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

   const handleModalCloseButton = () => {
      setUserEditModalVisible(false);
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
                              User control
                           </span>
                           <div
                              onClick={() => handleModalCloseButton()}
                              className=" group hover:bg-gray-100  w-8 cursor-pointer h-8 bg-gray-50 flex justify-center items-center">
                              <GrFormClose className="md:text-3xl text-xl" />
                           </div>
                        </div>
                        {/* Modal Tabs */}
                        <div className="flex">
                           <ul className="flex border-b-2 border-gray-200 w-full ">
                              <li
                                 onClick={() => handleTabClick('Account')}
                                 className={`group border-b-2 mr-3 hover:border-gray-800 ${
                                    userEditModalSection === `Account`
                                       ? `border-gray-800 font-semibold`
                                       : ``
                                 }  md:min-w-[100px] py-2 relative top-[2px]  cursor-pointer`}>
                                 <span className="group-hover:font-semibold md:text-base text-sm  ">
                                    Account
                                 </span>
                              </li>
                              <li
                                 onClick={() => handleTabClick('Subscription')}
                                 className={`border-b-2 group mr-3 hover:border-gray-800 ${
                                    userEditModalSection === `Subscription`
                                       ? `border-gray-800 font-semibold`
                                       : ``
                                 }  md: min-w-[100px] py-2 relative top-[2px]  cursor-pointer `}>
                                 <span className="group-hover:font-semibold  md:text-base text-sm  ">
                                    Subscription
                                 </span>
                              </li>

                              <li
                                 onClick={() => handleTabClick('Stats')}
                                 className={`border-b-2 group mr-3 hover:border-gray-800 md:min-w-[100px]  ${
                                    userEditModalSection === `Stats`
                                       ? `border-gray-800 font-semibold`
                                       : ``
                                 } py-2 relative top-[2px]  cursor-pointer  `}>
                                 <span className="group-hover:font-semibold   md:text-base text-sm ">
                                    Stats
                                 </span>
                              </li>

                              <li
                                 onClick={() => handleTabClick('Notifications')}
                                 className={`border-b-2 group mr-3 hover:border-gray-800 md:min-w-[100px]  ${
                                    userEditModalSection === `Notifications`
                                       ? `border-gray-800 font-semibold`
                                       : ``
                                 } py-2 relative top-[2px]  cursor-pointer  `}>
                                 <span className="group-hover:font-semibold   md:text-base text-sm ">
                                    {/* Head */}
                                    <div>
                                       <span className="group-hover:font-semibold md:text-lg text-base">
                                          Notifications
                                       </span>
                                    </div>
                                    {/* Body  */}
                                    <div className=""></div>
                                 </span>
                              </li>
                           </ul>
                        </div>
                        {/* Modal body */}
                        {/* Account section */}

                        {userEditModalSection == 'Account' && (
                           <div className="flex flex-col">
                              <form
                                 onSubmit={handleSubmit(handleModalSubmit)}
                                 className="flex flex-col h-full">
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Email
                                    </label>
                                    <input
                                       placeholder={
                                          selectedUser && selectedUser.email
                                       }
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       {...register('email')}
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="changePassword"
                                       className="text-sm text-gray-500">
                                       Change password
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="password"
                                       id="changePassword "
                                       {...register('password')}
                                    />
                                 </div>

                                 {/* dropdown with the same style of the inputs above make sure the arrow move on open and close */}
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="status"
                                       className="text-sm text-gray-500">
                                       Account status
                                    </label>
                                    <div className="flex flex-col">
                                       <select
                                          {...register('status')}
                                          id="status"
                                          className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold">
                                          <option>Active</option>
                                          <option>Banned</option>
                                       </select>
                                    </div>
                                 </div>

                                 <input
                                    type="submit"
                                    className=" mt-4 py-2 px-4 rounded-lg text-sm font-semibold text-white w-fit bg-[#413EF7]"
                                    value="Submit"
                                 />
                              </form>
                           </div>
                        )}

                        {userEditModalSection == 'Subscription' && (
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
                                          <option>Basic</option>
                                          <option>Pro</option>
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
                                       placeholder="Format: mm/dd/yyyy"
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
                                          {subscriptionsHistory.length == 0 && (
                                             <div>No subscriptions made by the user</div>
                                          )   
                                          }
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
                        )}

                        {userEditModalSection == 'Stats' && (
                           <div className="flex flex-col">
                              <form className="flex flex-col h-full">
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Total lookups
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={
                                          selectedUser.usage.keywordSearches
                                       }
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Competitors Searches
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={
                                          selectedUser.usage.totalCompSearches
                                       }
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Keywords Returned
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={
                                          selectedUser.usage.keywordsReturned
                                       }
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Favourites
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={selectedUser.usage.favourites}
                                    />
                                 </div>

                                 {/* use the same style above to render a list with subscription history, from to  */}
                                 {/* <div className='flex flex-col mt-3'>
                                                <label htmlFor="email" className='text-sm text-gray-500'>Associated ip's</label>
                                                <div className='flex flex-col'>
                                                    <ul className='flex flex-col my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold'>
                                                        <li className='flex space-x-2 '>
                                                            <span className='text-sm '>213.2.65.4</span>
                                                            <span className='text-sm '>Check multi accounts</span>
                                                            <span className='text-sm '>Ban ip</span>

                                                        </li>
                                                        <li className='flex space-x-2  '>
                                                        <span className='text-sm '>213.2.65.4</span>
                                                            <span className='text-sm '>Check multi accounts</span>
                                                            <span className='text-sm '>Ban ip</span>

                                                        </li>
                                                        <li className='flex space-x-2  '>
                                                            <span className='text-sm '>213.2.65.4</span>
                                                            <span className='text-sm '>Check multi accounts</span>
                                                            <span className='text-sm '>Ban ip</span>

                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> */}

                                 {/* <input type="submit" className=' mt-4 py-2 px-4 rounded-lg text-sm font-semibold text-white w-fit bg-[#413EF7]' value='Submit' /> */}
                              </form>
                           </div>
                        )}

                        {userEditModalSection == 'Notifications' && (
                           <form onSubmit={handleSubmit(handleModalSubmit)}>
                              <div>
                                 {/* Title */}
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Notification Title
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       {...register('notificationTitle')}
                                       id="notificationTitle"
                                    />
                                 </div>
                                 {/* Body */}
                                 <div className="flex flex-col mt-3">
                                    <label
                                       htmlFor="email"
                                       className="text-sm text-gray-500">
                                       Message
                                    </label>
                                    <textarea
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="description"
                                       multiple
                                       {...register('notificationMessage')}
                                    />
                                 </div>
                                 {/* Send */}
                                 <input
                                    type="submit"
                                    className=" mt-4 py-2 px-4 rounded-lg text-sm font-semibold text-white w-fit bg-[#413EF7]"
                                    value="Submit"
                                 />
                              </div>
                           </form>
                        )}
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Members</h1>
               <p>In here you can find and edit users data .</p>
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
                           <th className="px-4 py-2 font-semibold">Role</th>
                           <th className="px-4 py-2 font-semibold">
                              Membership
                           </th>
                           <th className="px-4 py-2 font-semibold">Verified</th>
                           <th className="px-4 py-2 font-semibold">
                              Created at
                           </th>
                        </tr>
                     </thead>
                     <tbody className="w-full ">
                        {lastMembers.length > 0 &&
                           // show only 1 lookup per page

                           (searchResult.length == 0
                              ? lastMembers
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
                                    {member.role}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {member.membership}
                                 </td>
                                 <td className=" px-4 py-4 text-center">
                                    {member.verified.toString()}
                                 </td>
                                 <td className=" px-4 py-4 text-center flex justify-center">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-14 h-4 rounded-lg flex min-w-[100px]  items-center justify-center `}>
                                       {
                                          // show date as dd/mm/yyyy
                                          member.createdAt
                                             .toString()
                                             .substring(0, 10)
                                       }
                                    </div>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               {/* Table end */}

               {/* Check if lastMembers is empty */}
               {lastMembers.length === 0 && (
                  <div className=" flex justify-center items-center  bg-white h-[300px] w-full flex-col">
                     <img
                        className="w-[100px] h-[100px]"
                        src={'/assets/Images/sad.svg'}
                     />
                     <p className="text-center text-title-color-muted my-2  text-base">
                        No lookups found
                     </p>
                     <p className="text-center text-title-color-muted   text-xs">
                        (Data will be added as soon you make a search)
                     </p>
                  </div>
               )}

               {/* Pagingation */}
               {lastMembers.length > 0 && (
                  <div className="flex items-center my-4">
                     <button
                        onClick={() => handlePreviousPage()}
                        className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">
                        Previous
                     </button>
                     <button className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">
                        {lastLookupPage}
                     </button>

                     <button
                        onClick={() => handleNextPage()}
                        className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2">
                        Next
                     </button>
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

export default Members;
