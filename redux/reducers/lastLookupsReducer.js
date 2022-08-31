import * as t from '../types/lastLookupTypes';

const initialState = {
   lookups: [],
};

const lastLookupsReducer = (state = initialState, action) => {
   // handle action type
   switch (action.type) {
      case t.SET_LOOKUP_SELECTED:
         return {
            ...state,
            lookups: state.lookups.map((lookup) => {
               if (lookup.id === action.payload) {
                  return {
                     ...lookup,
                     selected: !lookup.selected,
                  };
               }
               return lookup;
            }),
         };

      case t.SET_LOOKUP_UNSELECTED:
         return {
            ...state,
            lookups: state.lookups.map((lookup) => {
               if (lookup.id === action.payload) {
                  return {
                     ...lookup,
                     selected: !lookup.selected,
                  };
               }
               return lookup;
            }),
         };
      case t.DELETE_LOOKUP:
         return {
            ...state,
            lookups: state.lookups.filter(
               (lookup) => lookup.id !== action.payload
            ),
         };
      case t.SET_LOOKUPS:
         return {
            ...state,
            lookups: action.payload,
         };

      default:
         return { ...state };
   }
};

export default lastLookupsReducer;
