import React, { useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { connect } from 'react-redux';
import { Menu } from '@headlessui/react';
import { setSidebarOpen, setNotificationsOpen } from '../redux/actions/initsActions';
import { color } from '@mui/system';
import Link from 'next/link';

function Navbar({
   sidebar_open,
   setSidebarOpen,
   setNotificationsOpen,
   notificationsOpen,
   notifications,
}) {
   const [unreadMessages, setUnreadMessages] = React.useState(0);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const router = useRouter();

   // material colors for notifications circle
   const colors = [
      'bg-[#FFB300]',
      'bg-[#C2185B]',
      'bg-[#00796B]',
      'bg-[#7B1FA2]',
      'bg-[#303F9F]',
      'bg-[#1976D2]',
      'bg-[#0288D1]',
      'bg-[#0097A7]',
   ];
   // return randome color from color
   const getRandomColor = () => {
      return Math.floor(Math.random() * colors.length);
   };

   // handle search form submit using react hook form
   const onSubmit = (data) => {
      router.push('/dashboard/search/' + data.searchPhrase);
   };

   let data = {
      notificationCount: 1,
   };

   // handle sidebar toggle click
   const handleSidebarToggleClick = () => {
      setSidebarOpen(!sidebar_open);
   };

   // handle notifications click
   const handleNotificationsClick = () => {
      setNotificationsOpen(!notificationsOpen);
      handleMarkAllRead();
   };

   useEffect(() => {
      // get unread messages count

      console.log('getting the count');

      // foreach notifications get the read status count

      setUnreadMessages(0);

      notifications.forEach((notification) => {
         if (notification.read === false) {
            console.log('found unread message');
            setUnreadMessages((prev) => prev + 1);
         }
      });
   }, [notifications]);

   // make all notification read

   const handleMarkAllRead = () => {
      setUnreadMessages(0);
      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/notifications/readall', data)
         .then((res) => {});
   };
   return (
      <div className="min-h-[60px] md:p-0 p-3 border-b-[2px] border-border-color-light flex justify-between items-center ">
         <a className="md:hidden " onClick={() => handleSidebarToggleClick()}>
            <HiOutlineMenuAlt1 className=" w-8 h-8 mr-2" />
         </a>
         {/* navbar left */}
         <div className=" h-[40px]  ">
            {/* Search form */}
            {/* Create a small search form using react form hook */}
            <form
               className="md:mx-10 mx-0 h-full  flex items-center "
               onSubmit={handleSubmit(onSubmit)}>
               <input
                  placeholder="Search "
                  className="border rounded-tl-md rounded-bl-md md:w-[200px] w-[100px] outline-none py-1 text-sm pl-3 border-r-0 h-full"
                  {...register('searchPhrase')}
               />
               <button className="border rounded-tr-md rounded-br-md border-l-0 text-xl m-0 hover:bg-gray-50 cursor-pointer py-1 h-full w-[40px] flex justify-center items-center">
                  <AiOutlineSearch />
               </button>
            </form>
         </div>
         {/* navbar right */}
         <div className="ml-auto flex flex-row-reverse  items-center  justify-center">
            <Menu>
               <Menu.Button>
                  {' '}
                  {/* Avatar */}
                  <div className="w-[35px] h-[35px] bg-indigo-300 rounded-full overflow-hidden mx-5 cursor-pointer">
                     <img src="/assets/Images/man.svg" className="w-8 h-9" alt="ss" />
                  </div>
               </Menu.Button>
               <Menu.Items className="absolute top-12 right-10  bg-white rounded-md text-sm  shadow-md gap-1 font-semibold  flex flex-col">
                  {/* Use the `active` render prop to conditionally style the active item. */}
                  <Menu.Item>
                     {({ active }) => (
                        <Link
                           className={` p-3 ${
                              active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                           }`}
                           href="/">
                           <a
                              className={` p-3 ${
                                 active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                              }`}>
                              Home Page
                           </a>
                        </Link>
                     )}
                  </Menu.Item>

                  <Menu.Item>
                     {({ active }) => (
                        <Link
                           className={` p-3 ${
                              active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                           }`}
                           href="/dashboard/settings">
                           <a
                              className={` p-3 ${
                                 active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                              }`}>
                              Settings
                           </a>
                        </Link>
                     )}
                  </Menu.Item>

                  <Menu.Item>
                     {({ active }) => (
                        <Link
                           className={` p-3 ${
                              active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                           }`}
                           href="/dashboard/lookup">
                           <a
                              className={` p-3 ${
                                 active ? 'bg-gray-50 text-black' : 'bg-white text-gray-700'
                              }`}>
                              Search Keyword
                           </a>
                        </Link>
                     )}
                  </Menu.Item>

                  {/* ... */}
               </Menu.Items>
            </Menu>

            {/* Notification icon */}
            <div className="relative">
               <IoMdNotificationsOutline
                  onClick={() => handleNotificationsClick()}
                  className="w-6 h-6 text-title-color-muted cursor-pointer"
               />
               {/* Notification count */}
               {unreadMessages > 0 && (
                  <div className="absolute top-0 right-0 text-[10px] cursor-pointer text-white bg-color-danger rounded-full px-1">
                     {unreadMessages}
                  </div>
               )}

               {/* Notifications */}
               {notificationsOpen && (
                  <div className="w-[380px] h-[300px] z-40 overflow-y-scroll scrollbar-hide bg-white absolute rounded-md shadow-xl md:right-[0px] right-[-70px] top-[50px]  pt-2">
                     {/* Head */}
                     <div className="px-3 border-b">
                        <div className="flex justify-between items-center p-3">
                           <h3 className=" font-semibold">Notifications</h3>
                           <button className="text-[#5672B8] font-semibold">
                              {/* Mark all as read */}
                           </button>
                        </div>
                     </div>
                     {/* Body */}
                     <div className="h-[70%]">
                        {/* Notification Item */}
                        {notifications.map((notification, index) => {
                           return (
                              <div className="flex px-3 py-3 border-b  justify-between ">
                                 <div
                                    className={
                                       'w-[70px] h-[50px] ' +
                                       colors[getRandomColor()] +
                                       ' rounded-full text-white flex justify-center items-center'
                                    }>
                                    <span> {notification.notificationTitle.substr(0, 2)} </span>
                                 </div>
                                 <div className="flex flex-col w-full ml-3  ">
                                    <span className="font-semibold">
                                       {notification.notificationTitle}
                                    </span>
                                    <span className="text-xs">
                                       {notification.notificationMessage}
                                    </span>
                                 </div>
                                 <div className="flex justify-center items-center min-w-[70px]">
                                    <span className="text-xs ">2 min ago</span>
                                 </div>
                              </div>
                           );
                        })}
                        {notifications.length === 0 && (
                           <div className="w-full h-full flex justify-center items-center">
                              <span className="text-xs"> No Notifications.</span>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

const mapDispatchToProps = (dispatch) => {
   return {
      setSidebarOpen: (open) => dispatch(setSidebarOpen(open)),
      setNotificationsOpen: (open) => dispatch(setNotificationsOpen(open)),
   };
};
const mapStateToProps = (state) => {
   return {
      sidebar_open: state.inits.sidebar_open,
      notificationsOpen: state.inits.notifications_open,
      notifications: state.inits.notifications,
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
