import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer'; // Import du rootReducer

// Configuration du store Redux
export const store = configureStore({
  reducer: rootReducer,
});

// Custom hooks pour utiliser Redux
export const useSelectorstore = useReduxSelector; // Hook personnalisé pour sélectionner des données du state
export const useDispatch = () => useReduxDispatch(); // Hook personnalisé pour dispatcher des actions
