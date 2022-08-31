// dashboard page
import React, { useEffect } from 'react';
import DashLayout from '../../../Layouts/dashLayout';
import { AiOutlineUser, AiOutlineSend } from 'react-icons/ai';
import { MdPassword, MdOutlinePrivacyTip } from 'react-icons/md';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { FiHelpCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import {
   setToast,
   setToastTitle,
   setToastMessage,
   setToastType,
   setSubscriptions,
} from '../../../redux/actions/initsActions';
import { connect } from 'react-redux';
function Settings({ setToast, setToastTitle, setToastMessage, setToastType, setSubscriptions }) {
   const [logoImg, setLogoImg] = React.useState(null);

   const [initFormValues, setInitFormValues] = React.useState({});
   const [subscriptionsShowed, setSubscriptionsShowed] = React.useState(false);

   const {
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm({});

   useEffect(() => {
      // axios.post('/api/account/get', {}, { withCredentials: true }).then(res => {
      //     setInitFormValues(res.data.userData);
      //     console.log(res.data.userData);
      // });

      axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/settings/get',
            {},
            { withCredentials: true }
         )
         .then((res) => {
            setInitFormValues(res.data);
            setValue('emailverification', res.data.emailVerification);
            setValue('title', res.data.websiteTitle);
            setValue('description', res.data.websiteDescription);
            setValue('keywords', res.data.websiteKeywords);
            setValue('subscriptions', res.data.subscriptionsToggle);
            setValue('proprice', res.data.proprice);
            setValue('paypalkey', res.data.paypalkey);
            setValue('stripeclientkey', res.data.stripeclientkey);
            setValue('paymentMethod', res.data.paymentMethod);
            setValue('propriceyear', res.data.propriceyear);
            setValue('propricehalfyear', res.data.propricehalfyear);
            setValue('basicUsageLimit', res.data.basicUsageLimit);
            setValue('basicCompLimit', res.data.basicCompLimit);

         });

      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/lic/check', {}, { withCredentials: true })
         .then((res) => {
            if (res.status === 200) {
               if (res.data.lic === 'rg') {
                  setSubscriptionsShowed(false);
               } else {
                  setSubscriptionsShowed(true);
               }
            }
         });
   }, []);

   // handle change of the input of logo
   const handleLogoChange = (e) => {
      setLogoImg(e.target.files[0]);
   };

   const showToast = (type, title, message) => {
      setToastType(type);
      setToastTitle(title);
      setToastMessage(message);
      setToast(true);
      // after 3sconds set toast to false (hidden)
      setTimeout(() => {
         setToast(false);
      }, 3000);
   };

   const onSubmit = (data, type) => {
      // perform a switch based on type
      switch (type) {
         case 'Meta':
            const websiteTitle = data.title;
            const websiteDescription = data.description;
            const websiteKeywords = data.keywords;
            axios
               .post(
                  process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/settings',
                  { type, websiteTitle, websiteDescription, websiteKeywords },
                  { withCredentials: true }
               )
               .then((res) => {
                  if (res.status === 200) {
                     showToast('success', 'Success', 'Meta data updated');
                  }
               })
               .catch((err) => {
                  console.log(err);
                  showToast('error', 'Error', 'Error updating meta data');
               });
            break;
         case 'General':
            const websiteName = data.websitename;
            const emailVerification = data.emailverification;
            // use axios and FormData to send the websiteName,emailVerification,logo to the server
            // endpoing : /api/admin/settings
            var formData = new FormData();
            // if the user uploaded a new logo
            if (logoImg) {
               formData.append('logo', logoImg);
               axios
                  .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/settings/logo', formData, {
                     withCredentials: true,
                     headers: {
                        'Content-Type': 'multipart/form-data',
                     },
                  })
                  .then((res) => {
                     if (res.status === 200) {
                        showToast('success', 'Success', 'Logo updated');
                     }
                  })
                  .catch((err) => {
                     console.log(err);
                     // alert err returned message
                     showToast('error', 'Error', 'Error updating logo');
                  });
            }
            // use axios and FormData to send the websiteName,emailVerification to the server
            // endpoing : /api/admin/settings
            axios
               .post(
                  process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/settings',
                  { type, websiteName, emailVerification },
                  { withCredentials: true }
               )
               .then((res) => {
                  if (res.status === 200) {
                     showToast('success', 'Success', 'General settings updated');
                  }
               })
               .catch((err) => {
                  console.log(err);

                  showToast('error', 'Error', 'Error updating general settings');
               });

            break;
         case 'Subscriptions':
            let subscriptions = data.subscriptions;
            let proprice = data.proprice;
            let propricehalfyear = data.propricehalfyear;
            let propriceyear = data.propriceyear;
            let paypalkey = data.paypalkey;
            let stripeclientkey = data.stripeclientkey;
            let paymentMethod = data.paymentMethod;
            let basicUsageLimit = data.basicUsageLimit;
            let basicCompLimit = data.basicCompLimit

            axios
               .post(
                  process.env.NEXT_PUBLIC_PROD_URL + '/api/admin/settings',
                  {
                     type,
                     subscriptions,
                     proprice,
                     paypalkey,
                     stripeclientkey,
                     paymentMethod,
                     propricehalfyear,
                     propriceyear,
                     basicUsageLimit,
                     basicCompLimit
                  },
                  { withCredentials: true }
               )
               .then((res) => {
                  if (res.status === 200) {
                     showToast('success', 'Success', 'Subscriptions settings updated');
                     if (subscriptions == 'on') {
                        setSubscriptions(true);
                     } else if (subscriptions == 'off') {
                        setSubscriptions(false);
                     }
                  }
               })
               .catch((err) => {
                  console.log(err);
                  showToast('error', 'Error', 'Error updating subscriptions settings');
               });

            break;
      }
   };

   // a state that hold the  current tab
   const [currentTab, setCurrentTab] = React.useState('Meta');
   // a function that changes the current tab
   const changeTab = (tab) => {
      setCurrentTab(tab);
   };

   return (
      <DashLayout>
         <div className="bg-color-dashboard-bg flex flex-1 w-full h-full md:p-7 p-2  flex-col">
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Website Settings</h1>
               <p>Change your profile and account settings.</p>
            </div>
            {/* Settings Content */}
            <div className="bg-white rounded-md flex md:flex-row flex-col py-3 mt-5">
               {/* Left side */}
               <div className=" min-w-[280px] border-r">
                  <ul className="p-4 flex flex-col space-y-5 font-semibold ">
                     <li
                        onClick={() => changeTab('Meta')}
                        className="flex space-x-4  cursor-pointer group items-center">
                        <AiOutlineUser className="text-primary-color text-xl" />
                        <span
                           className={
                              currentTab === 'Meta'
                                 ? 'text-black'
                                 : 'text-title-color-muted group-hover:text-black'
                           }>
                           Metadata
                        </span>
                     </li>
                     <li
                        onClick={() => changeTab('Password')}
                        className="flex space-x-4  cursor-pointer group ">
                        <MdPassword className="text-primary-color  text-xl" />
                        <span
                           className={
                              currentTab === 'Password'
                                 ? 'text-black'
                                 : 'text-title-color-muted group-hover:text-black'
                           }>
                           General
                        </span>
                     </li>
                     {subscriptionsShowed === true && (
                        <li
                           onClick={() => changeTab('Subscriptions')}
                           className="flex space-x-4   cursor-pointer group items-center">
                           <IoIosNotificationsOutline className="text-primary-color text-xl" />
                           <span
                              className={
                                 currentTab === 'Notifications'
                                    ? 'text-black'
                                    : 'text-title-color-muted group-hover:text-black'
                              }>
                              Subscriptions
                           </span>
                        </li>
                     )}

                     <li
                        onClick={() => changeTab('Privacy')}
                        className="flex space-x-4  cursor-pointer group items-center">
                        <MdOutlinePrivacyTip className="text-primary-color text-xl" />
                        <span
                           className={
                              currentTab === 'Privacy'
                                 ? 'text-black'
                                 : 'text-title-color-muted group-hover:text-black'
                           }>
                           Privacy
                        </span>
                     </li>
                     {/* <li
                        onClick={() => changeTab('Help')}
                        className="flex space-x-4  cursor-pointer group items-center">
                        <FiHelpCircle className="text-primary-color text-xl" />
                        <span
                           className={
                              currentTab === 'Help'
                                 ? 'text-black'
                                 : 'text-title-color-muted group-hover:text-black'
                           }>
                           Help
                        </span>
                     </li> */}
                  </ul>
               </div>
               {/* Right side */}
               <div className="flex-grow">
                  {/* Account Section */}
                  <div className={currentTab === 'Meta' ? 'flex flex-col p-3' : 'hidden'}>
                     <span className="text-lg font-semibold text-text-primary-color">Metadata</span>
                     {/* Form */}
                     <form
                        className="flex flex-col"
                        onSubmit={handleSubmit((data) => onSubmit(data, 'Meta'))}>
                        {/* Row */}
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 Website title
                              </label>
                              <input
                                 type="text"
                                 className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                 name="title"
                                 {...register('title')}
                              />
                           </div>
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 Website Description
                              </label>
                              <input
                                 type="text"
                                 className="w-full p-2  border  rounded-md outline-none text-sm  mt-1"
                                 name="description"
                                 {...register('description')}
                              />
                           </div>
                        </div>
                        {/* Row */}
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 Keywords
                              </label>
                              <input
                                 type="text"
                                 className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                 name="keywords"
                                 {...register('keywords')}
                              />
                           </div>
                        </div>
                        {/* button */}
                        <button
                           className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}>
                           {' '}
                           <AiOutlineSend className="mr-2 " />{' '}
                           <span className="text-xs font-semibold">Submit</span>
                        </button>
                     </form>
                  </div>
                  {/* Password Section */}
                  <div className={currentTab === 'Password' ? 'flex flex-col p-3' : 'hidden'}>
                     <span className="text-lg font-semibold text-text-primary-color">General</span>
                     {/* Form */}
                     <form
                        className="flex flex-col"
                        onSubmit={handleSubmit((data) => onSubmit(data, 'General'))}>
                        {/* Row */}
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 WEBSITE NAME
                              </label>
                              <input
                                 defaultValue={initFormValues.websiteName}
                                 type="text"
                                 className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                 name="firstName"
                                 {...register('websitename')}
                              />
                              {errors.firstName && (
                                 <span className="text-red-600">This field is required</span>
                              )}
                           </div>
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 LOGO
                              </label>
                              <input
                                 type="file"
                                 className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                 name="firstName"
                                 onChange={(event) => handleLogoChange(event)}
                              />
                              {errors.firstName && (
                                 <span className="text-red-600">This field is required</span>
                              )}
                           </div>
                        </div>
                        {/* Row */}
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px]">
                              <label className="text-text-primary-color text-xs font-semibold  ">
                                 EMAIL VERIFICATION
                              </label>
                              <div className="flex items-center">
                                 <label
                                    htmlFor="emailVerificationOn"
                                    className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                    On
                                 </label>
                                 <input
                                    id="emailVerificationOn"
                                    defaultChecked={
                                       initFormValues.emailVerification == 'on' ? true : false
                                    }
                                    type="radio"
                                    name="emailVerification"
                                    value={'on'}
                                    className="mr-2 "
                                    {...register('emailverification')}
                                 />
                              </div>
                              <div className="flex items-center">
                                 <label
                                    htmlFor="emailVerificationOff"
                                    className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                    Off
                                 </label>
                                 <input
                                    id="emailVerificationOff"
                                    defaultChecked={
                                       initFormValues.emailVerification == 'off' ? true : false
                                    }
                                    type="radio"
                                    name="emailVerification"
                                    value={'off'}
                                    {...register('emailverification')}
                                 />
                              </div>
                           </div>
                        </div>
                        {/* button */}
                        <button
                           className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}>
                           {' '}
                           <AiOutlineSend className="mr-2 " />{' '}
                           <span className="text-xs font-semibold">Submit</span>
                        </button>
                     </form>
                  </div>
                  {/* Notifications Section */}
                  <div className={currentTab === 'Subscriptions' ? 'flex flex-col p-3' : 'hidden'}>
                     <span className="text-lg font-semibold text-text-primary-color">
                        Subscriptions Settings
                     </span>
                     {/* Form */}
                     <form
                        className="flex flex-col"
                        onSubmit={handleSubmit((data) => onSubmit(data, 'Subscriptions'))}>
                        {/* Row */}
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              <label className="text-text-primary-color text-xs font-semibold block my-2">
                                 SUBSCRIPTIONS STATUS
                              </label>
                              <div className="flex">
                                 <div className="flex items-center">
                                    <label
                                       htmlFor="subscriptionsOn"
                                       className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                       On
                                    </label>
                                    <input
                                       id="subscriptionsOn"
                                       defaultChecked={
                                          initFormValues.emailNotification == 'on' ? true : false
                                       }
                                       type="radio"
                                       name="subscriptions"
                                       value={'on'}
                                       className="mr-2 "
                                       {...register('subscriptions')}
                                    />
                                 </div>
                                 <div className="flex items-center">
                                    <label
                                       htmlFor="subscriptionsOfF"
                                       className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                       Off
                                    </label>
                                    <input
                                       id="subscriptionsOfF"
                                       defaultChecked={
                                          initFormValues.emailNotification == 'off' ? true : false
                                       }
                                       type="radio"
                                       name="subscriptions"
                                       value={'off'}
                                       {...register('subscriptions')}
                                    />
                                 </div>
                              </div>
                           </div>
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    MONTHLY PRICE
                                 </label>
                                 <input
                                    type="number"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="firstName"
                                    {...register('proprice')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    6 MONTHS PRICE
                                 </label>
                                 <input
                                    type="number"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="firstName"
                                    {...register('propricehalfyear')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    1 YEAR PRICE
                                 </label>
                                 <input
                                    type="number"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="firstName"
                                    {...register('propriceyear')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="flex md:flex-row flex-col md:space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    PAYPAL KEY
                                 </label>
                                 <input
                                    type="text"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="firstName"
                                    {...register('paypalkey')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>
                           {/* Input Item */}
                           {/* Input Select drop down with Stripe Paypal Both */}
                           <div className="my-2 min-w-[300px] ">
                              <label className="text-text-primary-color text-xs font-semibold block my-2">
                                 PAYMENT METHOD
                              </label>
                              <select
                                 className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                 name="paymentMethod"
                                 {...register('paymentMethod')}>
                                 <option value="Stripe">Stripe</option>
                                 <option value="Paypal">Paypal</option>
                                 <option value="Both">Both</option>
                              </select>
                           </div>

                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    BASIC USER LIMIT
                                 </label>
                                 <input
                                    type="text"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="basicUsageLimit"
                                    {...register('basicUsageLimit')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>

                              {/* Input Item */}
                              <div className="my-2 min-w-[300px] ">
                              {/* Input Item */}
                              <div className="my-2 min-w-[300px]">
                                 <label className="text-text-primary-color text-xs font-semibold  ">
                                    BASIC COMPETITION LIMIT
                                 </label>
                                 <input
                                    type="text"
                                    className="w-full p-2  border  rounded-md outline-none text-sm pl-2 mt-1"
                                    name="basicCompLimit"
                                    {...register('basicCompLimit')}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-600">This field is required</span>
                                 )}
                              </div>
                           </div>

                           
                        </div>

                        {/* button */}
                        <button
                           className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}>
                           {' '}
                           <AiOutlineSend className="mr-2 " />{' '}
                           <span className="text-xs font-semibold">Submit</span>
                        </button>
                     </form>
                  </div>
                  {/* Privacy Section */}
                  <div className={currentTab === 'Privacy' ? 'flex flex-col p-3' : 'hidden'}>
                     <span className="text-lg font-semibold text-text-primary-color">
                        Privacy Settings
                     </span>
                     {/* Form */}
                     <form
                        className="flex flex-col"
                        onSubmit={handleSubmit((data) => onSubmit(data, 'Privacy'))}>
                        {/* Row */}
                        <div className="flex space-x-8">
                           {/* Input Item */}
                           <div className="my-2 min-w-[300px] ">
                              <label className="text-text-primary-color text-xs font-semibold block my-2">
                                 Allow cookies
                              </label>
                              <div className="flex">
                                 <div className="flex items-center">
                                    <label
                                       for="cookiesOn"
                                       className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                       On
                                    </label>
                                    <input
                                       id="cookiesOn"
                                       type="radio"
                                       name="cookies"
                                       value={'on'}
                                       className="mr-2 "
                                       {...register('cookies')}
                                    />
                                 </div>
                                 <div className="flex items-center">
                                    <label
                                       for="cookiesOff"
                                       className="text-text-primary-color text-xs font-semibold block my-2 mr-2">
                                       Off
                                    </label>
                                    <input
                                       id="cookiesOff"
                                       type="radio"
                                       name="cookies"
                                       value={'off'}
                                       {...register('cookies')}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* button */}
                        <button
                           className={` w-fit flex items-center bg-[#24263A] text-white  px-4 py-2 rounded-md`}>
                           {' '}
                           <AiOutlineSend className="mr-2 " />{' '}
                           <span className="text-xs font-semibold">Submit</span>
                        </button>
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
                              This is a dummy help text. to be replaced with actual help text. This
                              is a dummy help text. to be replaced with actual help text. This is a
                              dummy help text. to be replaced with actual help text. This is a dummy
                              help text. to be replaced with actual help text. This is a dummy help
                              text. to be replaced with actual help text. This is a dummy help text.
                              to be replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text. This is a dummy help text. to be
                              replaced with actual help text.
                           </p>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </DashLayout>
   );
}

const mapDispatchToProps = (dispatch) => ({
   setToast: (toast) => dispatch(setToast(toast)),
   setToastTitle: (title) => dispatch(setToastTitle(title)),
   setToastMessage: (message) => dispatch(setToastMessage(message)),
   setToastType: (type) => dispatch(setToastType(type)),
   setSubscriptions: (subscriptions) => dispatch(setSubscriptions(subscriptions)),
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

export default connect(null, mapDispatchToProps)(Settings);
