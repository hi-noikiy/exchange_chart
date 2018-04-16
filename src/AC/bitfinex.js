import axios from 'axios';
import { BITFINEX_DATA_REQUEST, BITFINEX_DATA_SUCCESS, BITFINEX_DATA_FAILURE, BITFINEX_DATA_CLEAR,
    BITFINEX_TICKERS_REQUEST, BITFINEX_TICKERS_SUCCESS, BITFINEX_TICKERS_FAILURE} from '../constants/types';
import { BITFINEX_URL, PROXY_URL } from '../constants/urls';

export function bitfinexActionCreator(CONST, data, period) {
    return {
        type: CONST,
        payload: data,
        period: period
    };
}

export function bitfinexActionError(CONST, error) {
    return {
        type: CONST,
        payload: error
    };
}

export function bitfinexDataRequest(currencyFrom, period, limit) {
    let currencyTo = 'USD';
    let start = `${Date.now()}`.slice(0, -3);
    let end = `${+start - limit  + 60 * 20}000`;

    return dispatch => {
        dispatch(bitfinexActionCreator(BITFINEX_DATA_REQUEST));
        return axios.get(
            `${BITFINEX_URL}/candles/trade:${period}:t${currencyFrom}${currencyTo}/hist?limit=${limit}&start=${start}&end=${end}`
        ).then((response) => {
            dispatch(bitfinexActionCreator(BITFINEX_DATA_SUCCESS, response.data, period));
        }).catch(error => {
            const errorData = error.response.data;
            dispatch(bitfinexActionError(BITFINEX_DATA_FAILURE, errorData));
        });
    }
}

export function bitfinexDataClear() {
    return dispatch => {
        dispatch(bitfinexActionCreator(BITFINEX_DATA_CLEAR));
    };
}

export function bitfinexTickersRequest() {
    return dispatch => {
        dispatch(bitfinexActionCreator(BITFINEX_TICKERS_REQUEST));
        return axios.get(`${BITFINEX_URL}/tickers?symbols=tBTCUSD,tLTCUSD,tDSHUSD,tETHUSD`).then((response) => {
            dispatch(bitfinexActionCreator(BITFINEX_TICKERS_SUCCESS, response.data));
        }).catch(error => {
            const errorData = error.response.data;
            dispatch(bitfinexActionError(BITFINEX_TICKERS_FAILURE, errorData));
        });
    }
}