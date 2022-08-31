import React from 'react';
import DashLayout from '../../../Layouts/dashLayout';
import { useRouter } from 'next/router';
const SearchValue = () => {
   const router = useRouter();
   const { searchValue } = router.query;

   const searchTerms = [
      'about',
      'contact',
      'privacy',
      'terms',
      'services',
      'history',
      'favourites',
      'settings',
      'homepage',
      'pricing',
   ];

   const results = {
      about: {
         title: 'About Us Page',
         description:
            'About us page, this is where you can find information about the company, contact us, and more.',
      },
      contact: {
         title: 'Contact Us',
         description:
            'Contact us page, this is where you can find information about the company, contact us, and more.',
      },
      privacy: {
         title: 'Privacy Policy',
         description:
            'Privacy Policy page, here you find all information about the privacy policy of the company.',
      },
      terms: {
         title: 'Terms of Service',
         description:
            'Terms and Conditions page, here you find all information about the terms and conditions of the company.',
      },
      services: {
         title: 'Services',
         description:
            'Services page, here you find all information about the services of the company.',
      },
      history: {
         title: 'Keywords History',
         description: 'History page, in this page you can view all your searches history.',
      },
      favourites: {
         title: 'Favourited Keywords',
         description: 'Favourites page, in this page you can view all your favourites.',
      },
      settings: {
         title: 'Settings',
         description: 'Settings page, in this page you can change your settings.',
      },
      homepage: {
         title: 'Homepage',
         description: 'The homepage of the website.',
      },
      pricing: {
         title: 'Pricing',
         description: 'Pricing page, Check the pricing of each plan in this page.',
      },
   };

   /// use the search value if it exists in search Terms we return an array with the items that match
   const searchResults = searchTerms.filter((item) => item.includes(searchValue));

   return (
      <div>
         <DashLayout>
            <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7  flex-col">
               {/* Head */}
               <div className="">
                  <h1 className="font-semibold text-3xl py-3">Search Result</h1>
               </div>
               {/* Result */}
               {searchResults.map((item) => {
                  return (
                     <div className="bg-white rounded-md w-full h-fit p-4">
                        {/* Title */}
                        <div className=" flex flex-col">
                           <span className="text-[#2E379E] font-semibold text-xl">
                              { window.location.hostname + '  |  '+ results[item].title}
                           </span>
                           <span className="text-[#226C5E]">https://www.google.com</span>
                        </div>
                        {/* Body */}
                        <div>This is the description of the search</div>
                     </div>
                  );
              
               })}
                   { searchResults.length === 0 && (
                        <div className="bg-white rounded-md w-full h-fit p-4">
                            <div className="flex flex-col">
                                <span className="text-[#2E379E] font-semibold text-xl">
                                    No Results Found
                                </span>
                            </div>
                        </div>
                  )}
            </div>
         </DashLayout>
      </div>
   );
};

export default SearchValue;
