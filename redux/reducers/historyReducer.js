
import * as t from '../types/historyTypes';
const initialState = {
    history: [],

    // pagination
    perPage: 10,
    more: false,
    loading: false,
    error: null,
}


const historyReducer = (state = initialState, action) => {

    switch(action.type){
        case t.SET_HISTORY:
            return {
                ...state,
                history: action.history,
                more: action.history.length > state.perPage ? true : false,
                loading: false,
                error: null
            }
        case t.SET_MORE:
            return {
                ...state,
                more: action.more,
                loading: false,
                error: null
            }
        case t.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
                error: null
            }
        case t.SET_ERROR:
            return {
                ...state,
                error: action.error,
                loading: false
            }
        default:
            return state;
    }
}

export default historyReducer;
