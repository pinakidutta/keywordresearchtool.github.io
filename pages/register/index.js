// Same file as login but with the following changes:
// use this fields  email, password, repeat password and submit button

import React from 'react';
import { set, useForm } from 'react-hook-form';
import Link from 'next/link';
import { isEmpty } from '../../utils';
import axios from 'axios';
import Logo from '../../public/logo.png';
import Image from 'next/image';

const Register = () => {
   const [error, setError] = React.useState();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      // check if the password and repeat password are the same
      if (data.password !== data.repeatPassword) {
         setError({ message: 'Password and Repeat Password are not the same' });
         return;
      }
      // check if the password or password repeat is less than 8 characters
      // if not set the error message and return
      if (data.password.length < 8 || data.repeatPassword.length < 8) {
         setError({ message: 'Password must be at least 8 characters long.' });
         return;
      }
      setError({});
      /// here we can send the data to the server
      // send a post request to '/api/user/create'
      // and handle the response
      // if the response is ok redirect to the login page
      // if the response is not ok set the error message
      // and return

      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/user/create', {
            email: data.email,
            password: data.password,
         })
         .then((response) => {
            if (response.status === 200) {
               window.location.href = '/login';
            }
         })
         .catch((error) => {
            setError({ message: error.response.data.message });
         });
   };

   return (
      <div className=" h-screen w-full flex items-center justify-center">
         <svg
            className="absolute md:block hidden left-[-5%] top-[20%] z-10 transform translate-x-1/2"
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
            <rect
               width={404}
               height={404}
               fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
            />
         </svg>

         <svg
            className="absolute md:block hidden left-[55%] top-[40%] z-10 transform translate-x-1/2"
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
            <rect
               width={404}
               height={404}
               fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
            />
         </svg>
         {/* Register Content */}
         <div className="flex flex-col space-y-5 md:w-[400px] w-[85%] items-center">
            <Image src={Logo} />

            <span className="text-3xl font-bold text-title-color tracking-normal ">
               Register
            </span>
            {!isEmpty(error) && (
               <span className="text-red-500 text-sm">{error.message}</span>
            )}
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col  w-full">
               <div className="flex flex-col">
                  <label
                     className="text-lg font-semibold  py-2"
                     htmlFor="email">
                     Email
                  </label>
                  <input
                     className={`outline-none px-2 border rounded-md border-border-color-light text-lg h-[60px]  ${
                        errors.email
                           ? 'border-color-danger focus:bottom-0'
                           : 'focus:border-primary-color'
                     } `}
                     id="email"
                     type="email"
                     name="email"
                     {...register('email', { required: true })}
                  />
               </div>
               <div className="flex flex-col">
                  <label
                     className="text-lg font-semibold  py-2"
                     htmlFor="password">
                     Password
                  </label>
                  <input
                     className={`outline-none px-2 border rounded-md border-border-color-light text-lg h-[60px]  ${
                        errors.password
                           ? 'border-color-danger focus:bottom-0'
                           : 'focus:border-primary-color'
                     } `}
                     id="password"
                     type="password"
                     name="password"
                     {...register('password', { required: true })}
                  />
               </div>
               <div className="flex flex-col">
                  <label
                     className="text-lg font-semibold  py-2"
                     htmlFor="repeat-password">
                     Repeat Password
                  </label>
                  <input
                     className={`outline-none px-2 border rounded-md border-border-color-light text-lg h-[60px]  ${
                        errors.repeatPassword
                           ? 'border-color-danger focus:bottom-0'
                           : 'focus:border-primary-color'
                     } `}
                     id="repeat-password"
                     type="password"
                     name="repeatPassword"
                     {...register('repeatPassword', { required: true })}
                  />
               </div>
               <input
                  type="submit"
                  className="bg-primary-color py-5 text-white cursor-pointer rounded-md shadow-sm mt-5"
                  value={'Register'}
               />
            </form>
            <Link href="login">
               <a>
                  Already have an account?{' '}
                  <span className="text-primary-color">Login</span>
               </a>
            </Link>
         </div>
      </div>
   );
};

export default Register;
