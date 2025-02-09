import { combineReducers } from '@reduxjs/toolkit';
import AuthentificationReducer from '../Slice/AuthentificationSlice';
import { reducer as UiReducer } from '../Slice/UiSlice'; // Import correct du UiReducer

// Combinaison des reducers
const rootReducer = combineReducers({
  authentication: AuthentificationReducer, // Reducer pour l'authentification
  ui: UiReducer, // Reducer pour l'interface utilisateur
});

export default rootReducer;
