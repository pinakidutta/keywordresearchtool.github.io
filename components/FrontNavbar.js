import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Logo from '../public/logoWhite.png';
import LogoBlack from '../public/logo.png';
import Image from 'next/image';
import { BsQuestionCircle, BsCheckLg, BsDashLg, BsChevronDown } from 'react-icons/bs';
import { CgCloseR } from 'react-icons/cg';
import { FiMenu } from 'react-icons/fi';
import Link from 'next/link';

const FrontNavbar = ({ solutions, color, authStatus }) => {
   function classNames(...classes) {
      return classes.filter(Boolean).join(' ');
   }
   return (
      <Popover className="relative md:w-[100%]  md:px-[10%] bg-[#111317] ">
         <div className="flex justify-between items-center px-4  sm:px-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
               <a href="/">
                  <span className="sr-only">Workflow</span>
                  <Image src={Logo} alt="Logo" />
               </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
               <Popover.Button
                  className={
                     ' rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[' +
                     color +
                     ']'
                  }>
                  <span className="sr-only">Open menu</span>
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
               </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden md:flex items-center space-x-10">
               <Popover className="relative">
                  {({ open }) => (
                     <>
                        <Popover.Button
                           className={classNames(
                              open ? 'text-white' : 'text-gray-500',
                              'group rounded-md inline-flex items-center text-sm  hover:text-white focus:outline-none'
                           )}>
                           <span>Features</span>
                           <BsChevronDown
                              className={classNames(
                                 open ? 'text-gray-600' : 'text-gray-400',
                                 'ml-2 h-3 w-3  group-hover:text-gray-500'
                              )}
                              aria-hidden="true"
                           />
                        </Popover.Button>

                        <Transition
                           as={Fragment}
                           enter="transition ease-out duration-200"
                           enterFrom="opacity-0 translate-y-1"
                           enterTo="opacity-100 translate-y-0"
                           leave="transition ease-in duration-150"
                           leaveFrom="opacity-100 translate-y-0"
                           leaveTo="opacity-0 translate-y-1">
                           <Popover.Panel className="absolute z-40 -ml-4 mt-3 transform w-screen max-w-md lg:max-w-2xl lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                 <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                                    {solutions.map((solution) => (
                                       <a
                                          key={solution.name}
                                          href={solution.href}
                                          className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
                                          <div
                                             className={
                                                'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-[' +
                                                color +
                                                '] text-white sm:h-12 sm:w-12'
                                             }>
                                             <solution.icon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                             />
                                          </div>
                                          <div className="ml-4">
                                             <p className="text-base font-medium text-gray-900">
                                                {solution.name}
                                             </p>
                                             <p className="mt-1 text-sm text-gray-500">
                                                {solution.description}
                                             </p>
                                          </div>
                                       </a>
                                    ))}
                                 </div>
                                 {/* <div className="p-5 bg-gray-50 sm:p-8">
                               <a
                                  href="#"
                                  className="-m-3 p-3 flow-root rounded-md hover:bg-gray-100"
                               >
                                  <div className="flex items-center">
                                     <div className="text-base font-medium text-gray-900">
                                        Privacy Policy
                                     </div>
                                     <span className={"ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-["+color+"]"}>
                                        New
                                     </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                     Empower your entire team with even
                                     more advanced tools.
                                  </p>
                               </a>
                            </div> */}
                              </div>
                           </Popover.Panel>
                        </Transition>
                     </>
                  )}
               </Popover>

               <a
                  href="/pricing"
                  className="text-sm  text-gray-500 hover:text-white">
                  Pricing
               </a>
               <a
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-white">
                  Contact Us
               </a>
               <a
                  href="/privacy"
                  className="text-sm  text-gray-500 hover:text-white">
                  Privacy Policy
               </a>
               <a href="/about" className="text-sm  text-gray-500 hover:text-white">
                  About Us
               </a>
            </Popover.Group>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
               {authStatus === 'authenticated' ? (
                  <Link href="/dashboard">
                     <a
                        className={
                           'ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-1  border border-transparent rounded-md shadow-sm text-sm  text-white bg-[' +
                           color +
                           '] hover:bg-[' +
                           color +
                           ']'
                        }>
                        Dashboard
                     </a>
                  </Link>
               ) : (
                  <div>
                     <Link href="/login">
                        <a className="whitespace-nowrap text-sm  text-white hover:text-white border rounded-md px-4 py-1">
                           Sign in
                        </a>
                     </Link>
                     <Link href="/register">
                        <a
                           className={
                              'ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-1  border border-transparent rounded-md shadow-sm text-sm  text-white bg-[' +
                              color +
                              '] hover:bg-[' +
                              color +
                              ']'
                           }>
                           Sign up
                        </a>
                     </Link>
                  </div>
               )}
            </div>
         </div>

         <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Popover.Panel
               focus
               className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right  z-50 md:hidden">
               <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                  <div className="pt-5 pb-6 px-5">
                     <div className="flex items-center justify-between">
                        <div>
                           <Image src={LogoBlack} alt="Logo" />
                        </div>
                        <div className="-mr-2">
                           <Popover.Button
                              className={
                                 'bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[' +
                                 color +
                                 ']'
                              }>
                              <span className="sr-only">Close menu</span>
                              <CgCloseR className="h-6 w-6" aria-hidden="true" />
                           </Popover.Button>
                        </div>
                     </div>
                     <div className="mt-6">
                        <nav className="grid grid-cols-1 gap-7">
                           {solutions.map((solution) => (
                              <a
                                 key={solution.name}
                                 href={solution.href}
                                 className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
                                 <div
                                    className={
                                       'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-[' +
                                       color +
                                       '] text-white'
                                    }>
                                    <solution.icon className="h-6 w-6" aria-hidden="true" />
                                 </div>
                                 <div className="ml-4 text-base font-medium text-gray-900">
                                    {solution.name}
                                 </div>
                              </a>
                           ))}
                        </nav>
                     </div>
                  </div>
                  <div className="py-6 px-5">
                     <div className="grid grid-cols-2 gap-4">
                        <a
                           href="#"
                           className="text-base font-medium text-gray-900 hover:text-gray-700">
                           Pricing
                        </a>

                        <a
                           href="/about"
                           className="text-base font-medium text-gray-900 hover:text-gray-700">
                           About
                        </a>

                        <a
                           href="/contact"
                           className="text-base font-medium text-gray-900 hover:text-gray-700">
                           Contact Us
                        </a>

                        <a
                           href="/privacy"
                           className="text-base text-gray-900 hover:text-gray-700">
                           Privacy Policy
                        </a>
                     </div>
                     <div className="mt-6">
                        <a
                           href="/register"
                           className={
                              'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[' +
                              color +
                              '] hover:bg-[' +
                              color +
                              ']'
                           }>
                           Sign up
                        </a>
                        <p className="mt-6    text-center text-base font-medium text-gray-500">
                           Existing customer?{' '}
                           <a
                              href="/login"
                              className={'text-[' + color + '] hover:text-[' + color + ']'}>
                              Sign in
                           </a>
                        </p>
                     </div>
                  </div>
               </div>
            </Popover.Panel>
         </Transition>
      </Popover>
   );
};

export default FrontNavbar;
