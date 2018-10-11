import axios from 'axios';
import { KRAKEN_DATA_REQUEST, KRAKEN_DATA_SUCCESS, KRAKEN_DATA_FAILURE, KRAKEN_DATA_CLEAR, KRAKEN_TICKERS_REQUEST,
    KRAKEN_TICKERS_SUCCESS, KRAKEN_TICKERS_FAILURE } from '../constants/types';
import { KRAKEN_URL } from '../constants/urls';

export function krakenActionCreator(CONST, data, interval) {
    return {
        type: CONST,
        payload: data,
        interval: interval
    };
}

export function krakenActionError(CONST, error) {
    return {
        type: CONST,
        payload: error
    };
}

export function krakenDataRequest(currencyFrom, interval, since) {
    const now = new Date() - 1000;
    const day = 1000 * 60 * 60 * 24;

    switch (interval) {
        case '15m': interval = 15; break;
        case '1h': interval = 60; break;
        case '4h': interval = 240; break;
        case '1D': interval = 60 * 24; break;
    }

    switch (since) {
        case 'day': since = `${now - day}`.slice(0, -3); break;
        case 'week': since = `${now - day * 7}`.slice(0, -3); break;
        case 'month': since = `${now - day * 30}`.slice(0, -3); break;
        case 'year': since = `${now - day * 365}`.slice(0, -3); break;
    }

    switch (currencyFrom) {
        case 'BTC': currencyFrom = 'XXBTZ'; break;
        case 'ETH': currencyFrom = 'XETHZ'; break;
        case 'LTC': currencyFrom = 'XLTCZ'; break;
        case 'DSH': currencyFrom = 'DASH'; break;
    }

    let currencyTo = 'USD';
    let pair = `${currencyFrom}${currencyTo}`;

    return dispatch => {
        dispatch(krakenActionCreator(KRAKEN_DATA_REQUEST));
        return axios.get(`${KRAKEN_URL}/OHLC?pair=${pair}&interval=${interval}&since=${since}`).then((response) => {
            dispatch(krakenActionCreator(KRAKEN_DATA_SUCCESS, response.data.result[pair], interval));
        }).catch(error => {
            const errorData = error.response.data;
            dispatch(krakenActionError(KRAKEN_DATA_FAILURE, errorData));
        });
    }
}

export function krakenDataClear() {
    return dispatch => {
        dispatch(krakenActionCreator(KRAKEN_DATA_CLEAR));
    };
}

export function krakenTickersRequest() {
    return dispatch => {
        dispatch(krakenActionCreator(KRAKEN_TICKERS_REQUEST));
        return axios.get(`${KRAKEN_URL}/Ticker?pair=XXBTZUSD,DASHUSD,XLTCZUSD,XETHZUSD`).then((response) => {
            dispatch(krakenActionCreator(KRAKEN_TICKERS_SUCCESS, response.data.result));
        }).catch(error => {
            const errorData = error.response.data;
            dispatch(krakenActionError(KRAKEN_TICKERS_FAILURE, errorData));
        });
    }
}
