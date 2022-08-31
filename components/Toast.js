import React from 'react';
import { RiShieldCheckFill } from 'react-icons/ri';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ toast, title, message, type }) {
   return (
      <AnimatePresence>
         {toast && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className={`w-[400px] p-2 h-fit border-2   ${
                  type === `success`
                     ? `bg-[#F1F8F4]  border-[#36C38F] `
                     : type === `info`
                     ? `bg-[#E7EFFA]  border-[#3186EA] `
                     : type === `warning`
                     ? `bg-[#FEF8EB]  border-[#E49F09] `
                     : type === `danger` && `bg-[#FBEFEB]  border-[#DE3F3F] `
               } absolute   z-50 md:top-4  md:right-[2%] right-[1%] top-[20px] rounded-md flex `}>
               {/* Left side */}
               <div
                  className={`w-6 h-6 flex justify-center items-center relative top-1  rounded-full ${
                     type === 'success'
                        ? `bg-[#36C38F]`
                        : type === 'info'
                        ? `bg-[#3186EA]`
                        : type === 'warning'
                        ? `bg-[#E49F09]`
                        : type === 'danger' && `bg-[#DE3F3F]`
                  } 
             `}>
                  {type === 'success' ? (
                     <RiShieldCheckFill className="text-white w-3 h-3" />
                  ) : type === 'info' ? (
                     <BsFillExclamationCircleFill className="text-white w-3 h-3" />
                  ) : type === 'warning' ? (
                     <BsFillExclamationCircleFill className="text-white w-3 h-3" />
                  ) : type === 'danger' ? (
                     <AiFillCloseCircle className="text-white w-4 h-4" />
                  ) : (
                     ''
                  )}
               </div>

               {/* rightside */}
               <div className="ml-2">
                  <span
                     className={`text-sm font-semibold ${
                        type === 'success'
                           ? `text-[#326659]`
                           : type === 'info'
                           ? `text-[#2357C1]`
                           : type === 'warning'
                           ? `text-[#73420F]`
                           : type === 'danger' && `text-[#9E2D2C]`
                     } 
                   `}>
                     {title}
                  </span>
                  <p
                     className={`text-xs 
                  ${
                     type === 'success'
                        ? `text-[#326659]`
                        : type === 'info'
                        ? `text-[#2357C1]`
                        : type === 'warning'
                        ? `text-[#73420F]`
                        : type === 'danger' && `text-[#9E2D2C]`
                  } 
                  `}>
                     {message}
                  </p>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   );
}

const mapStateToProps = (state) => {
   return {
      toast: state.inits.toast,
      title: state.inits.toastTitle,
      message: state.inits.toastMessage,
      type: state.inits.toastType,
   };
};

export default connect(mapStateToProps, null)(Toast);
