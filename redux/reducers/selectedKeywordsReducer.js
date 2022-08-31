import * as t from "../types/types";


const initialState = {
    selected_keywords: [],
    selected_keyword: {}
};


const selectedKeywordsReducer = (state = initialState, action) => {

    // handle action type
    switch (action.type) {

        case t.ADD_SELECTED_KEYWORD:
            return {
                ...state,
                selected_keywords: [...state.selected_keywords, action.payload]
            };

        case t.REMOVE_SELECTED_KEYWORD:
            return {
                ...state,
                selected_keywords: state.selected_keywords.filter(keyword => keyword.id !== action.payload.id)
            };
        
        case t.CLEAR_SELECTED_KEYWORDS:
            return {
                ...state,
                selected_keywords: []
            };
            
        default:
            return { ...state };
    }

};



export default selectedKeywordsReducer

