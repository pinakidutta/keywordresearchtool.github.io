import * as t from '../types/userTypes'

const initialState = {
   role: '',
   uid:''
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case t.SET_ROLE:
            return {
                ...state,
                role: action.payload
            }
        case t.SET_USER_ID:
            return {
                ...state,
                uid: action.payload
            }
        default:
            return {...state}};
    
}

export default userReducer