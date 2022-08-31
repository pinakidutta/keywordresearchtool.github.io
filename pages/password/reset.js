import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Logo from '../../public/logo.png';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { setRole, setUid } from '../../redux/actions/userActions';
import Image from 'next/image';
import axios from 'axios';
import { setSubscriptions } from '../../redux/actions/initsActions';

const Reset = ({ setRole, setUid, setSubscriptions }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const router = useRouter();
   // state to hold if an error is showed
   const [error, setError] = React.useState(false);

   const [sucessShowed, setSuccessShowed] = React.useState(false);

   const onSubmit = async (data) => {
    setSuccessShowed(true);
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
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
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
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
         </svg>

         {/* Login Content */}
         <div className="flex flex-col space-y-5 md:w-[400px] w-[85%] items-center">
            {/* Logo */}
            <Image src={Logo} width={220} height={56} />
            <span className="text-3xl font-bold text-title-color tracking-normal ">
               Reset your password
            </span>
            {sucessShowed && (
               <span className=" text-sm"> A verification email will be sent if this email is in our database.</span>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  w-full">
               <div className="flex flex-col">
                  <label className="text-lg font-semibold  py-2" htmlFor="email">
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

               <input
                  type="submit"
                  className="bg-primary-color py-5 my-10 text-white cursor-pointer rounded-md shadow-sm"
                  value={'Reset Password'}
               />
            </form>
            <Link href={'register'}>
               <a>
                  Don't have an account?
                  <span className="text-primary-color"> Sign up</span>
               </a>
            </Link>
         </div>
      </div>
   );
};

const mapDispatchToProps = (dispatch) => {
   return {
      setRole: (role) => {
         dispatch(setRole(role));
      },
      setUid: (uid) => {
         dispatch(setUid(uid));
      },
      setSubscriptions: (subscriptions) => {
         dispatch(setSubscriptions(subscriptions));
      },
   };
};

export default connect(null, mapDispatchToProps)(Reset);
