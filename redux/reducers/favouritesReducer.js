import * as t from '../types/favouritesTypes';

const initialState = {

 favourites :  [

    // {
    //     id: 1,
    //     keyword: "Hello world how are  you doiing 1",
    //     date: "2020-01-01",
    //     status: "success",
    //     volume: "100",
    //     competitition: "100",
    //     difficulty: 80,
    //     cpc: "100",
    //     dailyImpression: "100",
    //     selected: false,
    //     favourited:true
    // }
],
}


const favouritesReducer = (state = initialState, action) => {
    
    // handle action type
    switch (action.type) {

        case t.SET_FAVOURITES:
            return {
                ...state,
                favourites: action.payload
            };
        default:
            return { ...state };
    }

}

export default favouritesReducer


