// dashboard page

import React, { useEffect } from "react";
import DashLayout from "../../../Layouts/dashLayout";
import { AiOutlineUser, AiOutlineSend } from "react-icons/ai";
import { MdPassword, MdOutlinePrivacyTip } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiHelpCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import axios from "axios";
import { NextSeo } from "next-seo";


export default function Settings() {    

        const { register, handleSubmit, formState: { errors } } = useForm();

        const [initFormValues, setInitFormValues] = React.useState({
               
        });




        useEffect(() => {
                axios.post( process.env.NEXT_PUBLIC_PROD_URL +'/api/account/get', {},{withCredentials:true}).then(res => {
                        setInitFormValues(res.data.userData);
                        console.log(res.data.userData);
                });
        }, []);
        const onSubmit = (data, type) => {
                // perform a switch based on type
                switch (type) {
                        case "Account":
                                // we get firstname,lastname,username from the request and we set them to the user in the database
                                const firstname = data.firstname;
                                const lastname = data.lastname;
                                const username = data.username;

                                axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/account/edit", { type, firstname, lastname, username }, { withCredentials: true }).then(res => {

                                        if (res.status === 200) {
                                                alert("Account updated");
                                        }
                                }).catch(err => {
                                        console.log(err);
                                        alert("Account update failed");
                                }
                                );
                                break;
                        case "Password":
                                // we check passwords if they match
                                const password = data.newpassword;
                                const confirmPassword = data.newpasswordRepeat;
                                const currentPassword = data.currentpassword;
                                if (password !== confirmPassword) {
                                        alert("Passwords do not match");
                                        return;
                                }
                                axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/account/edit", { type:type, password:password,currentPassword:currentPassword }, { withCredentials: true }).then(res => {

                                        if (res.status === 200) {
                                                alert(res.data.message);
                                        }
                                }).catch(err => {
                                        console.log(err);
                                }
                                );
                                break;

                        case "Notification":
                                const emailNotification = data.emailNotification;       
                                const inAppNotification = data.inAppNotifications;

                                axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/account/edit", { type:type, emailNotification:emailNotification, inAppNotification:inAppNotification }, { withCredentials: true }).then(res => {
                                                
                                                if (res.status === 200) {
                                                        alert(res.data);
                                                }
                                        }
                                ).catch(err => {
                                        console.log(err);
                                }
                                );
                                break;

                        case "Privacy":
                                const privacy = data.cookies;
                                axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/account/edit", { type:type, privacy:privacy }, { withCredentials: true }).then(res => {

                                        if (res.status === 200) {
                                                alert(res.data);
                                        }
                                }).catch(err => {
                                        console.log(err);
                                }
                                );
                                break;


                };
        }



        // a state that hold the  current tab
        const [currentTab, setCurrentTab] = React.useState("Account");

        // a function that changes the current tab
        const changeTab = (tab) => {
                setCurrentTab(tab);
        }



        return (
                <DashLayout>
                                                   <NextSeo title={"Settings"} description={"Settings ."} />

                        <div className='bg-color-dashboard-bg flex flex-1 w-full h-full md:p-7 p-2  flex-col'>
                                {/* Head */}
                                <div className="">
                                        <h1 className="font-semibold text-3xl py-3">Account Settings</h1>
                                        <p>Change your profile and account settings.</p>
                                </div>

                                {/* Settings Content */}

                                <div className="bg-white rounded-md flex md:flex-row flex-col py-3 mt-5">
                                        {/* Left side */}
                                        <div className=" min-w-[280px] border-r">
                                                <ul className="p-4 flex flex-col space-y-5 font-semibold ">
                                                        <li onClick={() => changeTab('Account')} className="flex space-x-4  cursor-pointer group items-center">
                                                                <AiOutlineUser className="text-primary-color text-xl" />
                                                                <span className={currentTab === 'Account' ? 'text-black' : 'text-title-color-muted group-hover:text-black'} >Account</span>
                                                        </li>
                                                        <li onClick={() => changeTab('Password')} className="flex space-x-4  cursor-pointer group ">
                                                                <MdPassword className="text-primary-color  text-xl" />
                                                                <span className={currentTab === 'Password' ? 'text-black' : 'text-title-color-muted group-hover:text-black'}>Password</span>
                                                        </li>
                                                        <li onClick={() => changeTab('Notifications')} className="flex space-x-4   cursor-pointer group items-center">
                                                                <IoIosNotificationsOutline className="text-primary-color text-xl" />
                                                                <span className={currentTab === 'Notifications' ? 'text-black' : 'text-title-color-muted group-hover:text-black'}>Notifications</span>
                                                        </li>
                                                        <li onClick={() => changeTab('Privacy')} className="flex space-x-4  cursor-pointer group items-center">
                                                                <MdOutlinePrivacyTip className="text-primary-color text-xl" />
                                                                <span className={currentTab === 'Privacy' ? 'text-black' : 'text-title-color-muted group-hover:text-black'}>Privacy</span>
                                                        </li>
                                                        {/* <li onClick={() => changeTab('Help')} className="flex space-x-4  cursor-pointer group items-center">
                                                                <FiHelpCircle className="text-primary-color text-xl" />
                                                                <span className={currentTab === 'Help' ? 'text-black' : 'text-title-color-muted group-hover:text-black'}>Help</span>
                                                        </li> */}
                                                </ul>
                                        </div>
                                        {/* Right side */}
                                        <div className="flex-grow">
                                                {/* Account Section */}

                                                <div className={currentTab === 'Account' ? 'flex flex-col p-3' : 'hidden'}>
                                                        <span className="text-lg font-semibold text-text-primary-color">General Info</span>
                                                        {/* Form */}
                                                        <form className="flex flex-col" onSubmit={handleSubmit(data => onSubmit(data, 'Account'))}>
                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">FIRST NAME</label>
                                                                                <input type="text" placeholder={initFormValues.firstname} className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="firstName"  {...register('firstname')} />

                                                                        </div>

                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">LAST NAME</label>
                                                                                <input type="text" placeholder={initFormValues.lastname} className="w-full p-2  border  rounded-md outline-none text-sm  mt-1" name="lastName"  {...register('lastname')} />

                                                                        </div>

                                                                </div>

                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">EMAIL </label>
                                                                                <input type="text" placeholder={initFormValues.email} disabled className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="email"  {...register('email')} />

                                                                        </div>

                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">USERNAME</label>
                                                                                <input type="text" placeholder={initFormValues.username} className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="username"  {...register('username')} />

                                                                        </div>
                                                                </div>

                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px] flex flex-col">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">MEMBERSHIP </label>
                                                                                <span className="text-sm font-semibold py-3">{initFormValues.membership}</span>

                                                                        </div>

                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px] flex flex-col">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">MEMBERSHIP ENDS </label>
                                                                                <span className="text-sm font-semibold py-3">02-06-2020</span>

                                                                        </div>
                                                                </div>

                                                                {/* button */}


                                                                <button className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}> <AiOutlineSend className="mr-2 " />  <span className="text-xs font-semibold">Submit</span></button>


                                                        </form>
                                                </div>

                                                {/* Password Section */}
                                                <div className={currentTab === 'Password' ? 'flex flex-col p-3' : 'hidden'}>
                                                        <span className="text-lg font-semibold text-text-primary-color">Change Password</span>
                                                        {/* Form */}
                                                        <form className="flex flex-col" onSubmit={handleSubmit( (data)=> onSubmit(data,'Password'))}>
                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">CURRENT PASSWORD</label>
                                                                                <input type="password" className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="firstName"  {...register('currentpassword')} />
                                                                                {errors.firstName && <span className="text-red-600">This field is required</span>}
                                                                        </div>



                                                                </div>

                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">NEW PASSWORD </label>
                                                                                <input type="password" className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="email"  {...register('newpassword')} />
                                                                        </div>

                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px]">
                                                                                <label className="text-text-primary-color text-xs font-semibold  ">NEW PASSWORD REPEAT</label>
                                                                                <input type="password" className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1" name="username"  {...register('newpasswordRepeat')} />
                                                                        </div>
                                                                </div>

                                                                {/* button */}


                                                                <button className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}> <AiOutlineSend className="mr-2 " />  <span className="text-xs font-semibold">Submit</span></button>


                                                        </form>
                                                </div>

                                                {/* Notifications Section */}
                                                <div className={currentTab === 'Notifications' ? 'flex flex-col p-3' : 'hidden'}>
                                                        <span className="text-lg font-semibold text-text-primary-color">Notifications Settings</span>
                                                        {/* Form */}
                                                        <form className="flex flex-col" onSubmit={handleSubmit(data=>onSubmit(data,'Notification'))}>
                                                                {/* Row */}
                                                                <div className="flex md:flex-row flex-col md:space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px] ">
                                                                                <label className="text-text-primary-color text-xs font-semibold block my-2">Email Notifications</label>
                                                                                <div className="flex">
                                                                                        <div className="flex items-center">
                                                                                                <label htmlFor='emailNotificationON' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">On</label>
                                                                                                <input id="emailNotificationON" defaultChecked = {initFormValues.emailNotification == 'on' ? true : false } type="radio" name="emailNotification" value={'on'} className='mr-2 '  {...register('emailNotification')} />
                                                                                        </div>

                                                                                        <div className="flex items-center">
                                                                                                <label htmlFor='emailNotificationOff' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">Off</label>
                                                                                                <input id="emailNotificationOff" defaultChecked = {initFormValues.emailNotification == 'off' ? true : false} type="radio" name="emailNotification" value={'off'}  {...register('emailNotification')} />
                                                                                        </div>
                                                                                </div>




                                                                        </div>

                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px] ">
                                                                                <label className="text-text-primary-color text-xs font-semibold block my-2">In-app Notifications</label>
                                                                                <div className="flex">
                                                                                        <div className="flex items-center">
                                                                                                <label htmlFor='inAppNotificationsON' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">On</label>
                                                                                                <input id="inAppNotificationsON" type="radio" name="inAppNotifications" value={'on'} className='mr-2 '  {...register('inAppNotifications')} />
                                                                                        </div>

                                                                                        <div className="flex items-center">
                                                                                                <label htmlFor='inAppNotificationsOff' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">Off</label>
                                                                                                <input id="inAppNotificationsOff" type="radio" name="inAppNotifications" value={'off'}  {...register('inAppNotifications')} />
                                                                                        </div>
                                                                                </div>




                                                                        </div>



                                                                </div>



                                                                {/* button */}


                                                                <button className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}> <AiOutlineSend className="mr-2 " />  <span className="text-xs font-semibold">Submit</span></button>


                                                        </form>
                                                </div>

                                                {/* Privacy Section */}
                                                <div className={currentTab === 'Privacy' ? 'flex flex-col p-3' : 'hidden'}>
                                                        <span className="text-lg font-semibold text-text-primary-color">Privacy Settings</span>
                                                        {/* Form */}
                                                        <form className="flex flex-col" onSubmit={handleSubmit(data=>onSubmit(data,'Privacy'))}>
                                                                {/* Row */}
                                                                <div className="flex space-x-8">
                                                                        {/* Input Item */}
                                                                        <div className="my-2 min-w-[300px] ">
                                                                                <label className="text-text-primary-color text-xs font-semibold block my-2">Allow cookies</label>
                                                                                <div className="flex">
                                                                                        <div className="flex items-center">
                                                                                                <label for='cookiesOn' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">On</label>
                                                                                                <input id="cookiesOn" type="radio" name="cookies" value={'on'} className='mr-2 '  {...register('cookies')} />
                                                                                        </div>

                                                                                        <div className="flex items-center">
                                                                                                <label for='cookiesOff' className="text-text-primary-color text-xs font-semibold block my-2 mr-2">Off</label>
                                                                                                <input id="cookiesOff" type="radio" name="cookies" value={'off'}  {...register('cookies')} />
                                                                                        </div>
                                                                                </div>




                                                                        </div>





                                                                </div>



                                                                {/* button */}


                                                                <button className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}> <AiOutlineSend className="mr-2 " />  <span className="text-xs font-semibold">Submit</span></button>


                                                        </form>
                                                </div>

                                                {/* Help Section */}
                                                <div className={currentTab === 'Help' ? 'flex flex-col p-3' : 'hidden'}>
                                                        <span className="text-lg font-semibold text-text-primary-color">Help </span>
                                                        {/* Form */}
                                                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                                                                {/* Row */}
                                                                <div className="flex space-x-8">

                                                                        <p className="text-xs my-5 max-w-[1000px]">
                                                                                {/* type dummy help text */}

                                                                                This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.
                                                                                This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.
                                                                                This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.
                                                                                This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.  This is a dummy help text. to be replaced with actual help text.

                                                                        </p>



                                                                </div>





                                                        </form>
                                                </div>
                                        </div>

                                </div>

                        </div>






                </DashLayout>
        )
}


export async function getServerSideProps(context) {
        const session = await getSession(context)

        if (!session) {
                
                return {
                        redirect: {
                                destination: '/login',
                                permanent: false,
                        },
                }
        }

        return {
                props: { session }
        }
}






