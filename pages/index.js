// Homepage : Static

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Logo from '../public/logo.png';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { NextSeo } from 'next-seo';
import { CgExport } from 'react-icons/cg';
import { BsQuestionCircle, BsCheckLg, BsDashLg, BsChevronDown } from 'react-icons/bs';
import { MdOutlineAttachMoney } from 'react-icons/md';

import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FiBarChart } from 'react-icons/fi';
import { SiSpeedtest } from 'react-icons/si';
import { Disclosure } from '@headlessui/react';
import FrontNavbar from '../components/FrontNavbar';
import FrontFooter from '../components/FrontFooter';
import { AiOutlineStar } from 'react-icons/ai';

function MyApp({}) {
   const { data: session, status } = useSession();

   // page meta data
   const pageTitle = 'KW | Home';
   const pageDescription = 'KW | Home';

   // Front end text can be modified here
   const pricing = {
      monthly: {
         price: '$10',
      },
      yearly: {
         price: '$100',
      },
   };

   const faqs = [
      {
         question: 'Is it possible to pay monthly?',
         answer:
            "Yes, we have both annual and monthly plans. Don't forget that you can save up to 40% by subscribing to the annual plan when compared to the plan paid monthly!",
      },
      {
         question: 'How can I pay for subscription?',
         answer: 'You can pay by credit/debit card, Paypal.',
      },
      {
         question: 'Do you offer a free trial?',
         answer: 'We offer a basic plan where you can test the tool and see how it works.',
      },
      // More questions...
   ];

   const features = [
      {
         name: 'Interface',
         icon: MdOutlineSpaceDashboard,
         description:
            'Our tool is very easy to use and straight forward interface that speed up the keyword research.   ',
      },
      {
         name: 'Difficulty',
         icon: SiSpeedtest,
         description:
            'Our algorithms gives each keyword an SEO ranking score, this saves you a lot of time finding the right keywords to rank for',
      },
      {
         name: 'Search Volume',
         icon: FiBarChart,
         description:
            'Find keywords and create content based on search volumes, identify trends and seasonal keywords that will boost traffic. ',
      },
      {
         name: 'Favourites',
         icon: AiOutlineStar,
         description:
            'You have full control over the list of keywords that you fetch, add them to your favourite to keep them in a safe place. ',
      },
      {
         name: 'Export Keywords',
         icon: CgExport,
         description:
            'When you are done with your research export the list of keywords to your computer in a single click.',
      },
      {
         name: 'CPC',
         icon: MdOutlineAttachMoney,
         description:
            'You are an advertiser? we got you, our tool returns the cost per click for most of the keywords.',
      },
   ];

   /// Head

   const solutions = [
      {
         name: 'Interface',
         description:
            'Simple and straightforward UI that makes keyword research for a fast research.',
         href: '#',
         icon: MdOutlineSpaceDashboard,
      },
      {
         name: 'Difficulty',
         description: 'Our algorithms assign an SEO ranking score to each term.',
         href: '#',
         icon: SiSpeedtest,
      },
      {
         name: 'Search Volume',
         description: 'Identify trends and seasonal keywords to enhance traffic.',
         href: '#',
         icon: FiBarChart,
      },
      {
         name: 'Favourites',
         description: 'You have complete control over the keywords you retrieve.',
         href: '#',
         icon: AiOutlineStar,
      },
      {
         name: 'Export Keywords',
         description: 'Save the list of keywords to your computer.',
         href: '#',
         icon: CgExport,
      },
      {
         name: 'CPC',
         description: 'Get the cost per click for each keyword.',
         href: '#',
         icon: MdOutlineAttachMoney,
      },
   ];

   function classNames(...classes) {
      return classes.filter(Boolean).join(' ');
   }

   return (
      //    wrapper
      <div className="relative">
         {/*    header */}
         <NextSeo title={pageTitle} description={pageDescription} />

         {/* Navbar */}
         <FrontNavbar authStatus={status} solutions={solutions} color="#2DCB73" />
         <svg
            className="absolute md:block hidden left-[-5%] top-[10%] z-10 transform translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
               <pattern
                  id="85737c0e-0916-41d7-917f-596dc7edfa27"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse">
                  <rect
                     x={0}
                     y={0}
                     width={4}
                     height={4}
                     className="text-gray-200"
                     fill="currentColor"
                  />
               </pattern>
            </defs>
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
         </svg>

         <svg
            className="absolute md:block hidden left-[50%] top-[20%] z-10 transform translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
               <pattern
                  id="85737c0e-0916-41d7-917f-596dc7edfa27"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse">
                  <rect
                     x={0}
                     y={0}
                     width={4}
                     height={4}
                     className="text-gray-200"
                     fill="currentColor"
                  />
               </pattern>
            </defs>
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
         </svg>

         <svg
            className="absolute md:block hidden left-[60%] top-[40%] z-10 transform translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
               <pattern
                  id="85737c0e-0916-41d7-917f-596dc7edfa27"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse">
                  <rect
                     x={0}
                     y={0}
                     width={4}
                     height={4}
                     className="text-gray-200"
                     fill="currentColor"
                  />
               </pattern>
            </defs>
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
         </svg>

         <svg
            className="absolute  md:block hidden left-[0%] top-[50%] z-10 transform translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true">
            <defs>
               <pattern
                  id="85737c0e-0916-41d7-917f-596dc7edfa27"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse">
                  <rect
                     x={0}
                     y={0}
                     width={4}
                     height={4}
                     className="text-gray-200"
                     fill="currentColor"
                  />
               </pattern>
            </defs>
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
         </svg>

         {/* Header */}
         <div className="w-[100%]  bg-[#590696]  relative z-20  my-18    ">
            <img
               src="assets/world.svg"
               className="absolute w-[90%] opacity-40 z-0 left-[5%] top-[10%]"
            />
            <div className=" w-[80%] mx-auto relative z-10 grid ">
               {/* Left side */}
               <div className="flex flex-col   md:mt-40 mt-10 md:w-[50%] mx-auto text-center">
                  {/* Small title */}
                  <div className="my-3">
                     <span className="font-semibold md:text-lg text-xs text-[#2DCB73]">
                        {' '}
                        🚀 Seo tool
                     </span>
                  </div>
                  {/* heading */}
                  <div className="flex flex-col justify-center items-center">
                     <h1 className="my-3 md:text-7xl text-4xl font-semibold text-white">
                        Find keywords with low SEO difficulty
                     </h1>
                     <p className="my-6 clear-left md:text-xl text-sm text-white">
                        Our tool helps you to find keywords that you can easily rank for, all what
                        you need to do is finding keywords with low SEO difficulty and high search
                        volume.
                     </p>
                     <form>
                        <div className="flex md:h-14  h-12 ">
                           <input
                              type=" text"
                              className="mx-2 rounded-md md:min-w-[400px] min-w-[200px] px-3 outline-none md:text-base text-xs"
                              placeholder="Enter Keyword or URL."
                           />
                           <a
                              className="bg-[#2DCB73] flex  justify-center items-center text-white px-8 py-2 md:text-base text-xs rounded-md shadow-md w-fit"
                              href="/login">
                              Get Started
                           </a>
                        </div>
                     </form>
                  </div>
               </div>
               {/* Right side */}
               {/* <div className="  ">
                  <div className="my-20">
                     <img src="/assets/Images/headImage.svg" alt="Head Image" />
                  </div>
               </div> */}
            </div>
            {/* Box White */}
            <div className="md:w-[1292px] md:h-[642px] w-[420px] h-[210px] rounded-lg bg-white shadow-xl overflow-hidden mx-auto relative top-28 mb-10">
               <div className=" w-full h-full">
                  <Image className='w-full h-full' src="/assets/Images/tool.webp" layout='fill' blurDataURL='' />

               </div>
            </div>
            {/* End of box White */}
         </div>
         {/* Header ends */}
         {/* Our product */}
         <div className="w-[80%]  mx-[10%] md:mt-50 mt-60">
            {/* Section Title */}
            <div className="w-full flex flex-col text-center">
               <span className="text-base font-semibold tracking-wider text-[#2DCB73] uppercase">
                  OUR PRODUCT
               </span>
               <span className="text-4xl font-bold my-4">
                  Keyword Research <br /> Tool
               </span>
            </div>
         </div>

         {/* End our product */}
         {/* Difficulty Section */}
         <div className="w-[80%] relative z-40  mx-[10%] md:mt-40 mt-20 grid md:grid-cols-2 grid-cols-1">
            <div>
               <img src="/assets/Images/progress.svg" alt="" />
            </div>
            <div className="md:mx-10 mx-0 my-auto">
               <h2 className="text-4xl md:text-left text-center font-bold my-4">
                  Built in indicators to help you find keywords with low SEO difficulty
               </h2>
               <p className="md:text-left text-center">
                  Our tool provides you with a set of indicators that helps you to find keywords
                  with low SEO difficulty. each keyword has a score that indicates how difficult it
                  is to rank for.
               </p>
            </div>
         </div>
         {/* End of difficulty Seciition */}

      
         {/* Features */}
         <div className="relative z-40 bg-white py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-md flex flex-col items-center px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
               <h2 className="text-base font-semibold tracking-wider text-[#2DCB73] uppercase">
                  RANK HIGHER
               </h2>

               <h2 className="text-4xl md:text-left text-center font-bold my-4">
                  Everything you need to deploy our tool
               </h2>
               <p className="text-left text-center">
                  We provide you with a set of tools and a simple and straightforward interface,
                  just like exactly how SEO tools should be.
               </p>

               <div className="mt-12">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                     {features.map((feature) => (
                        <div key={feature.name} className="pt-6">
                           <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                              <div className="-mt-6">
                                 <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-[#2DCB73] rounded-md shadow-lg">
                                       <feature.icon
                                          className="h-6 w-6 text-white"
                                          aria-hidden="true"
                                       />
                                    </span>
                                 </div>
                                 <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                    {feature.name}
                                 </h3>
                                 <p className="mt-5 text-base text-gray-500">
                                    {feature.description}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         {/* Features Ends */}

         <div className="w-[80%]  mx-[10%] mt-20">
            {/* Section Title */}
            <div className="w-full flex flex-col text-center">
               <span className="text-base font-semibold tracking-wider text-[#2DCB73] uppercase">
                  PRICING
               </span>
               <span className="text-4xl font-bold my-4">Compare our plans and find yours</span>
               <p className="text-[#7e7e7e] md:w-[600px] mx-auto ">
                  We've got a pricing plan that's perfect for you, we beleive that keyword research
                  tools should be accessible to all companies and individuals who want to find
                  keywords with low SEO difficulty.
               </p>
            </div>
         </div>
         {/* Pricing table */}
         <div className="w-[80%]  mx-[10%] mt-20 h-[800px]">
            {/* Head */}
            <div className="">
               {/* Head Top */}
               <div className="grid grid-cols-3 border-b pb-5">
                  <div></div>
                  <div className="font-semibold md:text-3xl text-lg ">Basic</div>
                  <div className="font-semibold md:text-3xl text-lg ">Pro</div>
               </div>
               {/* Head top End */}
               {/* Head Bottom */}
               <div className="grid grid-cols-3 mt-10">
                  <div></div>
                  <div className=" ">
                     {/* Price */}
                     <p className="md:text-base text-xs text-[#7e7e7e]">
                        <span className="font-semibold md:text-4xl text-xl text-black">$0</span> per
                        month
                     </p>
                     <p className="text-[#7e7e7e] md:text-base text-xs  my-6">
                        Limited use, only for trying out our tool and get a feel of it.
                     </p>

                     <a
                        className="bg-[#2DCB73] text-white md:px-8 md:py-2  md:text-base text-xs py-2 px-2 rounded-md shadow-md w-fit"
                        href="/login">
                        Get Started
                     </a>
                  </div>
                  <div className=" ">
                     {/* Price */}
                     <p className="md:text-base text-xs text-[#7e7e7e]">
                        <span className="font-semibold md:text-4xl text-xl text-black">$10</span>{' '}
                        per month
                     </p>
                     <p className="text-[#7e7e7e] md:text-base text-xs  my-6">
                        Pro, for those who want to use our tool with all of features .
                     </p>

                     <a
                        className="bg-[#2DCB73] text-white md:px-8 md:py-2  md:text-base text-xs py-2 px-2 rounded-md shadow-md w-fit"
                        href="/login">
                        Get Started
                     </a>
                  </div>
               </div>
               {/* Head Bottom Ends*/}
            </div>
            {/* Head Ends */}
            {/* Pricing Body  */}
            <div className="flex flex-col">
               {/* Pricing row */}
               <div className="grid grid-cols-3  py-2">
                  <div className="flex  md:text-base text-sm font-semibold text-[#2DCB73]">
                     Overview
                  </div>
                  <div></div>
                  <div></div>
               </div>
               {/* Pricing row : Basic Features */}
               <div className="grid grid-cols-3 my-2 rounded-md bg-[#F9FAFC] px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Basic Features
                     <Tooltip className="flex justify-center " title="Basic Features">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <div className="w-8 h-8 bg-[#CFFCDF] rounded-full flex justify-center items-center ">
                        <BsCheckLg className="w-3 fill-[#2DCB73]" />
                     </div>
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <div className="w-8 h-8 bg-[#CFFCDF] rounded-full flex justify-center items-center ">
                        <BsCheckLg className=" w-3 fill-[#2DCB73]" />
                     </div>
                  </div>
               </div>
               {/* Pricing row : Competitors Analysis  */}
               <div className="grid grid-cols-3 my-2 rounded-md bg-[#F9FAFC] px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Competitors Analysis
                     <Tooltip className="flex justify-center " title="Analyzing your competitors is easy with our Competitor Research tool. Start studying your rivals">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <span className="font-semibold">1</span>
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <span className="font-semibold">Unlimited</span>
                  </div>
               </div>
               {/* Pricing row : Difficulty */}
               <div className="grid grid-cols-3 my-2 rounded-md  px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Keyword Difficulty
                     <Tooltip className="flex justify-center " title="Our algorithms will provide with a difficulty score for each keyword.">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center items-center">
                     {/* Check mark */}
                     <BsDashLg className="w-5 fill-[#c8c8c8]" />
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <div className="w-8 h-8 bg-[#CFFCDF] rounded-full flex justify-center items-center ">
                        <BsCheckLg className=" w-3 fill-[#2DCB73]" />
                     </div>
                  </div>
               </div>

               {/* Pricing row : Lookups number */}
               <div className="grid grid-cols-3 my-2 bg-[#F9FAFC] rounded-md  px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Keyword searches
                     <Tooltip className="flex justify-center " title="Number of keyword searches.">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center items-center">
                     <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-center">
                     <span className="font-semibold">Unlimited</span>
                  </div>
               </div>

               {/* Pricing row : Keywords per search */}
               <div className="grid grid-cols-3 my-2 rounded-md  px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Keyword per search
                     <Tooltip className="flex justify-center " title="Number of keywords returned by your platform.">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center items-center">
                     <span className="font-semibold">4</span>
                  </div>
                  <div className="flex justify-center">
                     <span className="font-semibold">100</span>
                  </div>
               </div>
               {/* Pricing row : Export to csv */}
               <div className="grid grid-cols-3 my-2 bg-[#F9FAFC] rounded-md  px-3  py-2">
                  <div className="flex md:text-base text-sm  items-center font-semibold">
                     Export keywords
                     <Tooltip className="flex justify-center " title="Export keywords">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="flex justify-center items-center">
                     {/* Check mark */}
                     <BsDashLg className="w-5 fill-[#c8c8c8]" />
                  </div>
                  <div className="flex justify-center">
                     {/* Check mark */}
                     <div className="w-8 h-8 bg-[#CFFCDF] rounded-full flex justify-center items-center ">
                        <BsCheckLg className=" w-3 fill-[#2DCB73]" />
                     </div>
                  </div>
               </div>

          
          
            </div>
            {/* Pricing Body ends */}
         </div>

         {/* Pricing table ends */}

         <div className="w-[80%]  mx-[10%] mt-20">
            {/* Section Title */}
            <div className="w-full flex flex-col text-center">
               <span className="text-base font-semibold tracking-wider text-[#2DCB73] uppercase">
                  Faq
               </span>
               <span className="text-4xl font-bold my-4">Frequently asked Questions</span>
            </div>
         </div>

         {/* Faqs Start */}
         <div>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
               <div className="max-w-5xl mx-auto divide-y-2 divide-gray-200">
                  <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                     {faqs.map((faq) => (
                        <Disclosure as="div" key={faq.question} className="pt-6">
                           {({ open }) => (
                              <>
                                 <dt className="text-lg">
                                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                       <span className="font-medium text-gray-900">
                                          {faq.question}
                                       </span>
                                       <span className="ml-6 h-7 flex items-center">
                                          <BsChevronDown
                                             className={classNames(
                                                open ? '-rotate-180' : 'rotate-0',
                                                'h-6 w-6 transform'
                                             )}
                                             aria-hidden="true"
                                          />
                                       </span>
                                    </Disclosure.Button>
                                 </dt>
                                 <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                    <p className="text-base text-gray-500">{faq.answer}</p>
                                 </Disclosure.Panel>
                              </>
                           )}
                        </Disclosure>
                     ))}
                  </dl>
               </div>
            </div>
         </div>
         {/* Faqs Ends */}
         {/* Foooter */}
         <FrontFooter />
         {/* Footer ends */}
      </div>
   );
}

export default MyApp;
