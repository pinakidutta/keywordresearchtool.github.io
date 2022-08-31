
import * as t from '../types/historyTypes';

export const setHistory = (history) => {
    return {
        type: t.SET_HISTORY,
        history: history
    }
}

export const setMore = (more) => {
    return {
        type: t.SET_MORE,
        more: more
    }
}

export const setLoading = (loading) => {
    return {
        type: t.SET_LOADING,
        loading: loading
    }
}
export const setError = (error) => {
    return {
        type: t.SET_ERROR,
        error: error
    }
}
