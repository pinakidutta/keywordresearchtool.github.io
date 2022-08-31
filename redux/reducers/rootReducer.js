import selectedKeywordsReducer from "./selectedKeywordsReducer";
import lastLookupsReducer from "./lastLookupsReducer";
import { combineReducers } from "redux";
import initsReducer from "./initsReducer";
import keywordSearchReducer from "./keywordSearchReducer";
import favouritesReducer from "./favouritesReducer";
import historyReducer from "./historyReducer";
import userReducer from "./userReducer";

const allReducers = combineReducers({
    selectedKeywords: selectedKeywordsReducer,
    lastLookups: lastLookupsReducer,
    inits: initsReducer,
    keywordSearch: keywordSearchReducer,
    favourites: favouritesReducer,
    history: historyReducer,
    user: userReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
        state = undefined;
      }
    
    return allReducers(state, action);
  }

export default rootReducer;
