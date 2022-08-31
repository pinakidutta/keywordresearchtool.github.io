import * as t from '../types/types';

export const addSelectedKeyword = (keyword) => {
    return {
        type: t.ADD_SELECTED_KEYWORD,
        payload: keyword
    }
}

export const removeSelectedKeyword = (keyword) => {
    return {
        type: t.REMOVE_SELECTED_KEYWORD,
        payload: keyword
    }
}

export const clearSelectedKeywords = () => {
    return {
        type: t.CLEAR_SELECTED_KEYWORDS
    }
}
