import React,{useEffect} from 'react';
import axios from 'axios';
import {MdError} from 'react-icons/md';

const InstallationPage = () => {
   const [step, setStep] = React.useState(1);
   const [licenseKey, setLicenseKey] = React.useState('');

   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [passwordConfirm, setPasswordConfirm] = React.useState('');
   const [error, setError] = React.useState(false);


   const handleStepClick = (step) => {
      setStep(step);
   };

   const verifyLicenseKey = () => {
      setStep(3);
   };

   const stepBack = () => {
      setStep(step - 1);
   };

   const submitForm = () => {
      // check if password or password confirm is not empty
      if (password === '' || passwordConfirm === '') {
         return alert('Password is empty');
      }
      // check if email is empty
      if (email === '') {
         return alert('Email is empty');
      }

      if (password !== passwordConfirm) {
         alert('Passwords do not match');
         return;
      } else {
         axios
            .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/init', {
               email: email,
               password: password,
               licenseKey: licenseKey,
               domain: window.location.hostname,
            })
            .then((res) => {
               if (res.data.message == 'Success') {
                  // push to login page
                  window.location.href = '/login';
               } else if (res.data.message == 'License is invalid') {
                  setError(true);
               }
            })
            .catch((err) => {
               alert(err.response.data.message);
               setError(true);
            });
      }
   };


   useEffect(async () => {
     await axios.post(process.env.NEXT_PUBLIC_PROD_URL + '/api/init/check', {},{}).then((res) => {
         if (res.data.message == 'Initialised') {
            // push to login page
            window.location.href = '/login';
         }
      }
      ).catch((err) => {
         console.log(err);
      });
   }, []);
   

   return (
      <div className="w-full h-screen flex justify-center items-center">
         {/* First step welcome */}
         {step === 1 && (
            <div className="flex flex-col items-center ">
               <h2 className="text-4xl font-semibold my-4">Almost there</h2>
               <p>Your application is ready to be configured</p>
               <button
                  onClick={() => handleStepClick(2)}
                  className="py-3 rounded-md bg-[#30336b] cd my-4 text-white px-5">
                  Start
               </button>
            </div>
         )}
         {/* Step of entering the license key  */}
         {step === 2 && (
            <div className="flex flex-col items-center ">
               <h2 className="text-4xl font-semibold my-4">License verification</h2>
               <p>We need to verify your license key, (Contact us if you dont have one.)</p>
               <input
                  value={licenseKey}
                  onChange={(e) => {
                     setLicenseKey(e.target.value);
                  }}
                  className="border outline-none py-3 my-2 px-4 w-full"
                  placeholder="License key"
               />
               <div className="flex">
                  <button
                     onClick={() => stepBack()}
                     className="py-3  mr-2  rounded-md bg-white border-[#30336b] border my-4 text-[#30336b] px-5">
                     Back
                  </button>
                  <button
                     onClick={() => verifyLicenseKey()}
                     className="py-3 rounded-md bg-[#30336b] my-4 text-white px-5">
                     Start
                  </button>
               </div>
            </div>
         )}

         {/* Step up admin account  */}
         {step === 3 && (
            <div className="flex flex-col items-center ">
               <h2 className="text-4xl font-semibold my-4">Admin account</h2>
               <p>We need to create your admin account</p>

               {error && (
                   <div className="mt-5 rounded-md bg-red-50 p-4">
                   <div className="flex">
                      <div className="flex-shrink-0">
                         <MdError className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                         <h3 className="text-sm font-medium text-red-800">
                            An error occured, Reasons could be:
                         </h3>
                         <div className="mt-2 text-sm text-red-700">
                            <ul role="list" className="list-disc pl-5 space-y-1">
                               <li>You have an invalid license key</li>
                               <li>
                                  Your license has been used before, contact us to verify.
                               </li>
                            </ul>
                         </div>
                      </div>
                   </div>
                </div>
               ) }
               
               <input
                  onChange={(e) => {
                     setEmail(e.target.value);
                  }}
                  value={email}
                  className="border outline-none py-3 my-2 px-4 w-full"
                  placeholder="Email"
               />
               <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                     setPassword(e.target.value);
                  }}
                  className="border outline-none py-3 my-2 px-4 w-full"
                  placeholder="Password"
               />
               <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => {
                     setPasswordConfirm(e.target.value);
                  }}
                  className="border outline-none py-3 my-2 px-4 w-full"
                  placeholder="Password Confirm"
               />
               <div className="flex ">
                  <button
                     onClick={() => stepBack()}
                     className="py-3  mr-2  rounded-md bg-white border-[#30336b] border my-4 text-[#30336b] px-5">
                     Back
                  </button>
                  <button
                     onClick={() => submitForm()}
                     className="py-3 rounded-md bg-[#30336b] my-4 text-white px-5">
                     Submit
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default InstallationPage;
