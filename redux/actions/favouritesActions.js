
import * as t from '../types/favouritesTypes';


export const setFavourites = (favourites) => {
    
        return {
            type: t.SET_FAVOURITES,
            payload: favourites
        }
    }
    