// create a next.js sidebar component
import Link from 'next/link';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setRole, setUid } from '../redux/actions/userActions';
import { BiHomeAlt } from 'react-icons/bi';
import { GiStarKey } from 'react-icons/gi';
import { FiSettings } from 'react-icons/fi';
import { BiLogOut , BiBarChartSquare} from 'react-icons/bi';
import { signOut } from 'next-auth/react';
import { FaHistory } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
import { MdSpaceDashboard, MdSupervisorAccount } from 'react-icons/md';
import { FaDollarSign } from 'react-icons/fa';
import { GiUpgrade } from 'react-icons/gi';
import { HiOutlineMail } from 'react-icons/hi';
import Logo from '../public/logo.png';
import Image from 'next/image';
import { setSidebarOpen, setSubscriptions } from '../redux/actions/initsActions';
import axios from 'axios';

function Sidebar({
   sidebar_open,
   setRole,
   setUid,
   role,
   setSidebarOpen,
   resetState,
   subscriptions,
   setSubscriptions,
}) {
   // handle signoutclick
   const handleSignoutClick = () => {
      resetState();
      setRole('');
      setUid('');
      signOut();
   };

   const { data: session } = useSession();

   useEffect(() => {
      console.log('ran');
      if (session) {
         if (role === '') {
            console.log(session);
            setRole(session.token.role);
            setUid(session.token.uid);
         }
      }
   }, [role, session]);

   useEffect(() => {
      console.log('get subscriptions toggle');
      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/subscriptions/status')
         .then((res) => {
            if (res.status === 200) {
               setSubscriptions(res.data.subscriptionsToggle);
            }
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   // handle sidebar click
   const handleSidebarClick = () => {
      setSidebarOpen(!sidebar_open);
   };

   return (
      <div
         className={`md:flex flex-col   md:min-h-screen md:min-w-[270px] md:w-[270px] w-full  h-fit md:mb-0 mb-10  ${
            sidebar_open ? 'flex' : 'hidden'
         }  border-r border-r-border-color-light px-4`}>
         {/* Head */}
         <div className="h-20  flex justify-center items-center my-4">
            <Image src={Logo} />
         </div>
         {/* Body */}
         <div className="flex flex-col space-y-2 h-full ">
            {/* Sidebar Section */}

            <div className="flex flex-col space-y-2">
               {/* Section Head */}
               {/* Section Head */}
               <div className="flex flex-row">
                  <span className="text-color-sidebar-head text-sm font-semibold">MAIN</span>
               </div>
               {/* Section items */}
               <ul className="flex flex-col ">
                  <Link href={'/dashboard'}>
                     {/* Item */}
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer  rounded-md">
                        {/*  Icon*/}
                        <div>
                           <BiHomeAlt className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Home
                        </span>
                     </li>
                  </Link>
                  {/* Item */}
                  <Link href={'/dashboard/lookup'}>
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                        {/*  Icon*/}
                        <div>
                           <GiStarKey className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Keyword Tool
                        </span>
                     </li>
                  </Link>
                    {/* Item */}
                    <Link href={'/dashboard/competitors/analysis'}>
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                        {/*  Icon*/}
                        <div>
                           <BiBarChartSquare className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Competitors Analysis
                        </span>
                     </li>
                  </Link>
                  {/* Item */}
                  <Link href={'/dashboard/history'}>
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                        {/*  Icon*/}
                        <div>
                           <FaHistory className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Searches History
                        </span>
                     </li>
                  </Link>

                  {/* Item */}
                  <Link href={'/dashboard/favourites'}>
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                        {/*  Icon*/}
                        <div>
                           <AiOutlineStar className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Favourites
                        </span>
                     </li>
                  </Link>
               </ul>
            </div>
            {/* Sidebar seperator */}
            <div className="h-[1px] w-[90%] bg-border-color-light self-center"></div>
            {/* Sidebar Section */}
            <div className="flex flex-col space-y-2 ">
               {/* Section Head */}
               <div className="flex flex-row">
                  <span className="text-color-sidebar-head text-sm font-semibold">ACCOUNT</span>
               </div>
               {/* Section items */}
               <ul className="flex flex-col  ">
                  {/* Item */}
                  <li
                     onClick={() => handleSignoutClick()}
                     className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer  rounded-md">
                     {/*  Icon*/}
                     <div>
                        <BiLogOut className="text-2xl text-title-color-muted group-hover:text-title-color " />
                     </div>
                     {/* Name */}
                     <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                        Sign out
                     </span>
                  </li>
                  {/* Item */}
                  {subscriptions == true && (
                     <Link href={'/dashboard/upgrade'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                           {/*  Icon*/}
                           <div>
                              <GiUpgrade className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Upgrade
                           </span>

                           {/* notifications number */}
                           {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                        </li>
                     </Link>
                  )}

                  {/* Item */}
                  <Link href={'/dashboard/settings'}>
                     <li
                        onClick={() => handleSidebarClick()}
                        className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                        {/*  Icon*/}
                        <div>
                           <FiSettings className="text-2xl text-title-color-muted group-hover:text-title-color " />
                        </div>
                        {/* Name */}
                        <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                           Settings
                        </span>

                        {/* notifications number */}
                        {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                     </li>
                  </Link>
               </ul>
            </div>

            {/* Sidebar seperator */}
            <div className="h-[1px] w-[90%] bg-border-color-light self-center"></div>
            {/* Sidebar Section */}

            {role === 'admin' && (
               <div className="flex flex-col space-y-2 ">
                  {/* Section Head */}
                  <div className="flex flex-row">
                     <span className="text-color-sidebar-head text-sm font-semibold">
                        ADMIN
                     </span>
                  </div>
                  {/* Section items */}
                  <ul className="flex flex-col  ">
                     {/* Item */}
                     <Link href={'/dashboard/admin'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer  rounded-md">
                           {/*  Icon*/}
                           <div>
                              <MdSpaceDashboard className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Admin Dashbboard
                           </span>
                        </li>
                     </Link>
                     {/* Item */}
                     <Link href={'/dashboard/admin/settings'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                           {/*  Icon*/}
                           <div>
                              <FiSettings className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Website Settings
                           </span>

                           {/* notifications number */}
                           {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                        </li>
                     </Link>

                     {/* Item */}
                     <Link href={'/dashboard/admin/members'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                           {/*  Icon*/}
                           <div>
                              <MdSupervisorAccount className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Members
                           </span>

                           {/* notifications number */}
                           {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                        </li>
                     </Link>

                     {/* Item */}
                     <Link href={'/dashboard/admin/contact'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                           {/*  Icon*/}
                           <div>
                              <HiOutlineMail className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Messages
                           </span>

                           {/* notifications number */}
                           {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                        </li>
                     </Link>

                     {/* Item */}
                     <Link href={'/dashboard/admin/subscriptions'}>
                        <li
                           onClick={() => handleSidebarClick()}
                           className=" flex  space-x-3 items-center px-2 group hover:bg-color-sidebar-item-hover py-3 cursor-pointer rounded-md">
                           {/*  Icon*/}
                           <div>
                              <FaDollarSign className="text-2xl text-title-color-muted group-hover:text-title-color " />
                           </div>
                           {/* Name */}
                           <span className="text-title-color-muted font-semibold text-sm group-hover:text-title-color">
                              Subscriptions
                           </span>

                           {/* notifications number */}
                           {/* <div className='bg-red-500 text-white px-1 rounded-md '>
                                    10
                                </div> */}
                        </li>
                     </Link>
                  </ul>
               </div>
            )}
         </div>
         {/* Sidebar Footer */}
         <div className="flex mt-auto text-xs font-semibold">KwFinder v1.0.0</div>
      </div>
   );
}

const mapStateToProps = (state) => {
   return {
      sidebar_open: state.inits.sidebar_open,
      role: state.user.role,
      subscriptions: state.inits.subscriptions,
   };
};
const mapDispatchToProps = (dispatch) => {
   return {
      setRole: (role) => dispatch(setRole(role)),
      setUid: (uid) => dispatch(setUid(uid)),
      setSidebarOpen: (sidebar_open) => dispatch(setSidebarOpen(sidebar_open)),
      setSubscriptions: (subscriptions) => dispatch(setSubscriptions(subscriptions)),
      /// dispatch RESET_STATE ACTION
      resetState: () =>
         dispatch(() => {
            return {
               type: 'RESET_APP',
            };
         }),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
