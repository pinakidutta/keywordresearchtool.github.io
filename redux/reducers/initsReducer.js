import * as t from '../types/initsTypes';

const initialState = {
   user_verified: true,
   email_verification: true,
   sidebar_open: false,
   subscriptions:false,
   toast: false,
   toastTitle: '',
   toastMessage: '',
   toastType: '',
   notifications_open: false,
   notifications: [],
};

const initsReducer = (state = initialState, action) => {
   // handle action type
   switch (action.type) {
      case t.SET_USER_VERIFIED:
         return {
            ...state,
            user_verified: action.payload,
         };
      case t.SET_EMAIL_VERIFICATION:
         return {
            ...state,
            email_verification: action.payload,
         };
      case t.SET_SIDEBAR_OPEN:
         return {
            ...state,
            sidebar_open: action.payload,
         };

      case t.SET_TOAST:
         return {
            ...state,
            toast: action.payload,
         };
      case t.SET_TOAST_TITLE:
         return {
            ...state,
            toastTitle: action.payload,
         };
      case t.SET_TOAST_MESSAGE:
         return {
            ...state,
            toastMessage: action.payload,
         };
      case t.SET_TOAST_TYPE:
         return {
            ...state,
            toastType: action.payload,
         };
      case t.SET_NOTIFICATIONS_OPEN:
         return {
            ...state,
            notifications_open: action.payload,
         };
      case t.SET_NOTIFICATIONS:
         return {
            ...state,
            notifications: action.payload,
         };
      case t.SET_SUBSCRIPTIONS:
         return {
            ...state,
            subscriptions: action.payload,
         };

      default:
         return { ...state };
   }
};

export default initsReducer;
