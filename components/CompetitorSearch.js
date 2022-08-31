import React from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { ImLocation2 } from 'react-icons/im';
import { BiChevronRight } from 'react-icons/bi';

import LoadingSpinner from '../public/assets/Images/loading.svg';

function CompetitorSearch({ handleKeywordLookupSubmit, isLoading }) {
   // use ref for search Kw input
   const searchKwRef = React.createRef();


   const handleSearch = (e) => {
      e.preventDefault();

      handleKeywordLookupSubmit(searchKwRef.current.value);
   };

   
   return (
      <div className="flex ">
         <form className="flex md:flex-row flex-col w-full">
            {/* Keyword Input */}
            <div className="md:w-[300px]  w-full flex items-center justify-center bg-white h-[50px] border border-border-color-light  shadow-md ">
               <input
                  ref={searchKwRef}
                  type="text"
                  name="searchKW"
                  placeholder="Ex : https://www.domain.com"
                  className="px-3 py-2 w-full outline-none"
               />
            </div>
            {/* Country  */}
            {/* <div className="md:w-[300px] w-full  md:my-0 my-3 pl-2 flex items-center justify-center bg-white h-[50px] border border-border-color-light shadow-md ">

                    <ImLocation2 className="text-title-color text-xl" />
                    <select ref={countryRef} className="px-3 py-2 w-full outline-none bg-white">
                        <option value="">Select Country</option>
                        {countryListAllIsoData.map((country, index) => {
                            return (
                                <option key={index} value={country.name}>{country.name}</option>
                            )
                        })}

                    </select>
                </div> */}
            {/* Submit Button */}
            <div className="md:w-[300px] w-full md:ml-1 ml-0 pl-2 flex items-center justify-center bg-primary-color shadow-md  text-white h-[50px]">
               <button
                  onClick={(e) => handleSearch(e)}
                  className="px-3 py-2 w-full outline-none flex justify-center items-center "
               >
                  {isLoading ? (
                     <div className="animate-spin h-5 w-5 mr-3 text-white">
                        {' '}
                        <img src="/assets/Images/loading.svg" alt="" />{' '}
                     </div>
                  ) : (
                     ''
                  )}
                  <span>Analyse Domain</span>
                  <BiChevronRight className="text-xl" />
               </button>
            </div>
         </form>
      </div>
   );
}

export default CompetitorSearch;
