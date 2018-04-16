import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import bitfinexData from './bitfinex';
import krakenData from './kraken';
import currency from './currency';
import exchange from './exchange';
import filter from './filter';

export default combineReducers({
    bitfinexData, krakenData, exchange, filter, currency, routing: routerReducer,
});