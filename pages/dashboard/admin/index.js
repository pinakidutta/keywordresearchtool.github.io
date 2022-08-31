import React from 'react';
import DashLayout from '../../../Layouts/dashLayout';
import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { paginate, checkStringLength } from '../../../utils';
import { BsFillStarFill } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { GrFormClose } from 'react-icons/gr';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../lib/mongodb';
const Admin = ({ totalUsers, totalKeywordsSearched, totalSubscriptions, totalMessages }) => {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm();
   const [selectedKeywords, setSelectedKeywords] = React.useState([]);
   const [lastMembers, setLastMembers] = React.useState([]);
   const [searchResult, setSearchResult] = React.useState([]);
   const [lastLookupPage, setLastLookupPage] = React.useState(1);
   const [subscriptionsHistory, setSubscriptionsHistory] = React.useState([]);

   const [userEditModalVisible, setUserEditModalVisible] = React.useState(false);
   const [userEditModalSection, setUserEditModalSection] = React.useState('Account');

   const [selectedUser, setSelectedUser] = React.useState();

   const cards = [
      {
         title: 'Total Users',
         description: 'Total number of users',
         value: totalUsers,
         icon: '/assets/Images/users.svg',
      },
      {
         title: 'Total Keywords',
         description: 'Keyword returned by the API',
         value: totalKeywordsSearched,
         icon: '/assets/Images/subscriptions.svg',
      },
      {
         title: 'Subscriptions',
         description: 'Total number of subscriptions',
         value: totalSubscriptions,
         icon: '/assets/Images/subscriptions.svg',
      },
      {
         title: ' Messages',
         description: 'Number of Messages',
         value: totalMessages,
         icon: '/assets/Images/messages.svg',
      },
   ];

   // handle keyword  search form submit using react hook form
   const onKeywordSearch = (data) => {
      console.log(data);
      // check if there is any lookup that contains the keyphrase
      const lookups = lestMembers.filter((lookup) =>
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
         alert('No Lookup Found');
      }

      // if search pharse is empry
      // we cleare searchresult state
      if (data.searchPhrase === '') {
         setSearchResult([]);
      }
   };
   // function that adds coma to big numbers
   function addComma(num) {
      if (num !== null && num !== undefined)
         return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   }

   // useffect to get the last users
   React.useEffect(() => {
      getLastUsers();
   }, []);
   // action to perform when user selected
   React.useEffect(() => {
      if (selectedUser) {
         setValue('status', selectedUser.status);
         setValue('role', selectedUser.role);
         setValue('membership', selectedUser.membership);
         setValue('subscriptionEnds', selectedUser.subscriptionEnds);
      }
   }, [selectedUser]);

   // get last users
   const getLastUsers = () => {
      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/ad/users/getlast',
            {},
            { withCredentials: true }
         )
         .then((res) => {
            setLastMembers(res.data);
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

   // handle next page of last lookups
   function handleNextPage() {
      if (lastLookupPage < lastMembers.length / 5) {
         setLastLookupPage(lastLookupPage + 1);
      }
   }

   // handle previous page of last lookups
   function handlePreviousPage() {
      if (lastLookupPage > 1) {
         setLastLookupPage(lastMembers - 1);
      }
   }

   const openModal = (user) => {
      setUserEditModalVisible(true);
      setSelectedUser(user);
      getSubscriptionsHistory(user._id);
   };

   // const handle tab click
   const handleTabClick = (tab) => {
      setUserEditModalSection(tab);
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
               alert(err.response.data.error);
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
         const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
         // if the membership and subscriptionEnds are valid
         if (!dateRegex.test(data.subscriptionEnds)) {
            alert('Please Enter a Valid Date');
            return;
         }

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

   const handleModalCloseButton = () => {
      setUserEditModalVisible(false);
   };

   return (
      <DashLayout>
         <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7 relative flex-col">
            {/* User edit modal */}

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
                           <span className="font-semibold md:text-lg text-base">User control</span>
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
                                    <label htmlFor="email" className="text-sm text-gray-500">
                                       Email
                                    </label>
                                    <input
                                       placeholder={selectedUser && selectedUser.email}
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
                                    <label htmlFor="status" className="text-sm text-gray-500">
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
                                    <label htmlFor="status" className="text-sm text-gray-500">
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
                                    <label htmlFor="email" className="text-sm text-gray-500">
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
                                    <label htmlFor="email" className="text-sm text-gray-500">
                                       Subscription history
                                    </label>
                                    <div className="flex flex-col">
                                       <ul className="flex flex-col my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold">
                                          {subscriptionsHistory.length == 0 && (
                                             <div>No subscriptions made by the user</div>
                                          )}
                                          {subscriptionsHistory &&
                                             subscriptionsHistory.map((subscription) => (
                                                <li
                                                   className="flex space-x-2 "
                                                   key={subscription.id}>
                                                   <span className="text-sm ">
                                                      {convertDate(subscription.start)}
                                                   </span>
                                                   <span className="text-sm ">
                                                      {convertDate(subscription.ends)}
                                                   </span>
                                                </li>
                                             ))}
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
                                    <label htmlFor="email" className="text-sm text-gray-500">
                                       Total lookups
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={selectedUser.usage.keywordSearches}
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label htmlFor="email" className="text-sm text-gray-500">
                                       Keywords Returned
                                    </label>
                                    <input
                                       className="my-1 pl-2 py-3 bg-[#F4F8FB] outline-none border rounded-lg font-semibold"
                                       type="text"
                                       id="email"
                                       disabled
                                       value={selectedUser.usage.keywordsReturned}
                                    />
                                 </div>
                                 <div className="flex flex-col mt-3">
                                    <label htmlFor="email" className="text-sm text-gray-500">
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
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Cards */}
            <div className="flex w-full  flex-wrap ">
               {cards.map((card, index) => (
                  <div className="md:w-1/4 p-4 md:h-[200px] w-1/2 " key={index}>
                     <div className="bg-white border-border-color-light border rounded-lg p-4 h-full">
                        <div className="flex flex-row items-center">
                           <div className="flex-grow flex flex-col space-y-4">
                              <div className="flex justify-between">
                                 <h3 className="text-base  font-semibold  text-title-color-muted">
                                    {card.title}
                                 </h3>
                                 <p className="text-sm">
                                    <img src={card.icon} className="w-8 h-8 " alt="ss" />
                                 </p>
                              </div>
                              <p className="text-3xl font-bold  text-text-primary-color">
                                 {addComma(card.value)}
                              </p>
                              <p className="text-xs text-text-primary-color">{card.description}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Create am html table with the last members */}
            <div className="flex flex-col  bg-white p-7 mx-4 rounded-lg overflow-x-hidden h-[500px]  ">
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
               <div className=" overflow-x-scroll w-full ">
                  <table className="table-auto  w-full o  ">
                     <thead className="bg-table-head-bg ">
                        <tr className=" font-semibold  md:text-base text-xs">
                           <th className="px-4 py-2 font-semibold text-left ">Select</th>

                           <th className="px-4 py-2 font-semibold  text-left">_id</th>
                           <th className="px-4 py-2 font-semibold">Email</th>
                           <th className="px-4 py-2 font-semibold">Role</th>
                           <th className="px-4 py-2 font-semibold">Membership</th>
                           <th className="px-4 py-2 font-semibold">Verified</th>
                           <th className="px-4 py-2 font-semibold">Created at</th>
                        </tr>
                     </thead>
                     <tbody className="w-full  ">
                        {lastMembers.length > 0 &&
                           // show only 1 lookup per page

                           paginate(
                              searchResult.length == 0 ? lastMembers : searchResult,
                              10,
                              searchResult.length == 0 ? lastLookupPage : 1
                           ).map((member, index) => (
                              <tr
                                 key={index}
                                 onClick={() => openModal(member)}
                                 className="md:text-sm text-xs border-b bg-gray-50 hover:bg-gray-100 cursor-pointer font-semibold ">
                                 {/* check box input */}
                                 <td className=" px-4 py-4">
                                    <input
                                       onChange={() => handleCheckboxClick(member)}
                                       type="checkbox"
                                       checked={member.selected}
                                       className="form-checkbox"
                                    />
                                 </td>
                                 <td className=" px-4 py-4 flex items-center  ">
                                    {/* Set as favourite */}
                                    <BsFillStarFill className="mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer" />
                                    {checkStringLength(member._id)}
                                 </td>
                                 <td className=" px-4 py-4 md:min-w-[300px] text-center">
                                    {member.email}
                                 </td>
                                 <td className=" px-4 py-4 text-center">{member.role}</td>
                                 <td className=" px-4 py-4 text-center">{member.membership}</td>
                                 <td className=" px-4 py-4 text-center">
                                    {member.verified.toString()}
                                 </td>
                                 <td className=" px-4 py-4 text-center flex justify-center">
                                    {/* Difficulty box */}
                                    <div
                                       className={`w-14 h-4 rounded-lg flex min-w-[100px]  items-center justify-center `}>
                                       {
                                          // show date as dd/mm/yyyy
                                          member.createdAt.toString().substring(0, 10)
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
                  <div className=" flex justify-center items-center  bg-white h-[400px] w-full flex-col">
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
               {lastMembers.length > 0 && (
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
                        {lastMembers.length} results.
                     </span>
                  </div>
               )}
            </div>
         </div>
         {/* Cards End */}
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

   // find first document in collection 'inits'
   let totalUsersCount = 0;
   let totalKeywordsSearched = 0;
   let totalSubscriptions = 0;
   let totalMessages = 0;

   try {
      let db = await connectToDatabase();
      let inits = await db.db.collection('inits').find({}).toArray();
      console.log(inits);

      totalUsersCount = inits[0].totalUsers;
      totalKeywordsSearched = inits[0].totalKeywordsSearched;
      totalSubscriptions = inits[0].totalSubscriptions;
      totalMessages = inits[0].messages;
   } catch (error) {
      console.log(error);
   }

   return {
      props: {
         session,
         totalUsers: parseInt(totalUsersCount),
         totalKeywordsSearched: parseInt(totalKeywordsSearched),
         totalSubscriptions: parseInt(totalSubscriptions),
         totalMessages: parseInt(totalMessages),
      },
   };
}

export default Admin;
