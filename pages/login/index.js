import Link from 'next/link';
import React, { useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Logo from '../../public/logo.png';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { setRole, setUid } from '../../redux/actions/userActions';
import Image from 'next/image';
import axios from 'axios';
import { setSubscriptions } from '../../redux/actions/initsActions';

const Login = ({ setRole, setUid, setSubscriptions }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const router = useRouter();
   // state to hold if an error is showed
   const [error, setError] = React.useState(false);
   // hold the loading
   const [loading, setLoading] = React.useState(false);

   const onSubmit = async (data) => {
      setLoading(true);
      await axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/subscriptions/status')
         .then((res) => {
            if (res.status === 200) {
               setSubscriptions(res.data.subscriptionsToggle);
               // sign in the user using nextauth signIn and handle errors
               signIn('credentials', {
                  email: data.email,
                  password: data.password,
                  callbackUrl: '/dashboard',
                  redirect: false,
               }).then(async ({ error }) => {
                  if (error) {
                     console.log(error);
                     setError(true);
                  } else {
                     // get the subscriptions status
                     setLoading(false);
                     router.push('/dashboard');
                  }
               });
            }
         })
         .catch((err) => {
            setLoading(false);
            console.log(err);
         });
   };

   useEffect(() => {
      axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/init/check', {})
         .then((res) => {})
         .catch((err) => {
            // return the message from error
            console.log('error trying to do the init check');
            // puch to /install path
            router.push('/install');
         });
   }, []);

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
            <Image src={Logo} />
            <span className="text-3xl font-bold text-title-color tracking-normal ">Login</span>
            {error && (
               <span className="text-red-500 text-sm">Please verify you email and password.</span>
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
               <div className="flex flex-col">
                  <label className="text-lg font-semibold  py-2" htmlFor="password">
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

               <a className="py-3 text-primary-color" href="#">
                  {' '}
                  Forgot password?
               </a>
               <div className="bg-primary-color relative  text-white cursor-pointer rounded-md shadow-sm flex justify-center items-center">
                  {loading ? (
                     <div className="absolute md:left-36 left-32 animate-spin h-5 w-5 mr-3 text-white">
                        {' '}
                        <img src="/assets/Images/loading.svg" alt="" />{' '}
                     </div>
                  ) : (
                     ''
                  )}

                  <input type="submit" className="py-5 cursor-pointer w-full h-full " value={'Login'} />
               </div>
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

export default connect(null, mapDispatchToProps)(Login);
