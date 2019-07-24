import reducer from './store/reducer';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, composeEnhances(
    applyMiddleware(thunk)
));

export default  store;

export const persistor = persistStore(store);

