import * as t from '../types/lastLookupTypes';


export const setLookupSeleted = (lookup) => {
    return {
        type: t.SET_LOOKUP_SELECTED,
        payload: lookup.id
    }
}

export const setLookupUnSelected = (lookup) => {
    return {
        type: t.SET_LOOKUP_UNSELECTED,
        payload: lookup.id
    }
}

export const deleteLookup = (lookup) => {

    return {
        type: t.DELETE_LOOKUP,
        payload: lookup.id
    }
}

export const setLookups = (lookups) => {
    return {
        type: t.SET_LOOKUPS,
        payload: lookups
    }
}
