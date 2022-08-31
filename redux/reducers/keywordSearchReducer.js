import * as t from '../types/initsTypes';

const initialState = {
   keyword:'',
   result:[],
   difficulty:0,
   search_volume_history:[],
};


const  keywordSearchReducer = (state = initialState, action) => {

    // handle action type
    switch (action.type) {

        case t.SET_KEYWORD:
            return {
                ...state,
                keyword: action.payload
            };
        case t.SET_RESULT:
            return {
                ...state,
                result: action.payload
            };
        case t.SET_DIFFICULTY:
            return {
                ...state,
                difficulty: action.payload
            };
        case t.SET_SEARCH_VOLUME_HISTORY:
            return {
                ...state,
                search_volume_history: action.payload
            };
            
        default:
            return { ...state };
    }

};



export default keywordSearchReducer

