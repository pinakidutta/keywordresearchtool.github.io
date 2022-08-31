import * as t from "../types/keywordSearchTypes";


export const setKeyword = (keyword) => {
    return {
        type: t.SET_KEYWORD,
        payload: keyword
    }
}

export const setResult = (result) => {
    return {
        type: t.SET_RESULT,
        payload: result
    }
}

export const setDifficulty = (difficulty) => {
    return {
        type: t.SET_DIFFICULTY,
        payload: difficulty
    }
}

export const setSearchVolumeHistory = (search_volume_history) => {
    return {
        type: t.SET_SEARCH_VOLUME_HISTORY,
        payload: search_volume_history
    }
}
