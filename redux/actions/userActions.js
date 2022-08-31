import * as t from '../types/userTypes';

export const setRole = (role) => {
    return {
        type: t.SET_ROLE,
        payload: role
    }
}


export const setUid = (uid) => {
    return {
        type: t.SET_USER_ID,
        payload: uid
    }
}