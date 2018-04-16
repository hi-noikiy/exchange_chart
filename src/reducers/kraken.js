import { KRAKEN_DATA_REQUEST, KRAKEN_DATA_SUCCESS, KRAKEN_DATA_FAILURE, KRAKEN_DATA_CLEAR, KRAKEN_TICKERS_REQUEST,
    KRAKEN_TICKERS_SUCCESS, KRAKEN_TICKERS_FAILURE } from '../constants/types.js';

const initialState = {
    dates: [],
    fetching: false,
    tickers: {
        BTC: '',
        ETH: '',
        LTC: '',
        DSH: ''
    },
    status: false,
    values: []
};

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case KRAKEN_DATA_REQUEST:
            return {
                ...state,
                fetching: true,
                status: false
            };

        case KRAKEN_DATA_SUCCESS:
            const currentDate = new Date();
            let dates = [];
            let values = [];

            for (let item of action.payload) {
                if (item === undefined) return;
                let dateMs = +`${item[0]}000`;

                if (currentDate.getFullYear() - new Date(dateMs).getFullYear() >= 1
                    && currentDate.getMonth() === new Date(dateMs).getMonth()
                    && currentDate.getDate() === new Date(dateMs).getDate()) break;

                dates.push(new Date(dateMs).toLocaleDateString('en-GB', {
                    minute: '2-digit',
                    hour: '2-digit',
                    day : 'numeric',
                    month : 'short',
                    year : 'numeric'
                }));

                values.push(item[1]);
            }

            let lastTimeStamp = dates.shift();

            switch (action.interval) {
                case 15:
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleTimeString('en-GB',
                        { minute: '2-digit', hour: '2-digit' });
                    break;

                case 60:
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleDateString('en-GB',
                        { weekday: 'short', minute: '2-digit', hour: '2-digit' });
                    break;

                case 240:
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleDateString('en-GB',
                        { minute: '2-digit', hour: '2-digit', day: '2-digit', month: 'short' });
                    break;

                case 1440:
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleDateString('en-GB',
                        { day : '2-digit', month : 'short', year : 'numeric' });
                    break;
            }

            dates.unshift(lastTimeStamp);

            return {
                ...state,
                fetching: false,
                status: true,
                dates: dates,
                values: values,
            };

        case KRAKEN_DATA_FAILURE:
            return {
                ...state,
                fetching: false,
                status: false,
                error: action.payload
            };

        case KRAKEN_DATA_CLEAR:
            return state = initialState;

        case KRAKEN_TICKERS_REQUEST:
            return {
                ...state,
                fetching: true,
                status: false
            };

        case KRAKEN_TICKERS_SUCCESS:
            return {
                ...state,
                fetching: false,
                status: true,
                tickers: {
                    'BTC': parseFloat(action.payload.XXBTZUSD.c[0]),
                    'ETH': parseFloat(action.payload.XETHZUSD.c[0]),
                    'LTC': parseFloat(action.payload.XLTCZUSD.c[0]),
                    'DSH': parseFloat(action.payload.DASHUSD.c[0])
                }
            };

        case KRAKEN_TICKERS_FAILURE:
            return {
                ...state,
                fetching: false,
                status: false,
                error: action.payload
            };

        default: return state;
    }
}