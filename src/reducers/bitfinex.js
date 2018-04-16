import { BITFINEX_DATA_REQUEST, BITFINEX_DATA_SUCCESS, BITFINEX_DATA_FAILURE, BITFINEX_DATA_CLEAR,
    BITFINEX_TICKERS_REQUEST, BITFINEX_TICKERS_SUCCESS, BITFINEX_TICKERS_FAILURE} from '../constants/types';

const initialState = {
    dates: [],
    fetching: false,
    status: false,
    tickers: {
        BTC: '',
        ETH: '',
        LTC: '',
        DSH: ''
    },
    values: []
};

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case BITFINEX_DATA_REQUEST:
            return {
                ...state,
                fetching: true,
                status: false
            };

        case BITFINEX_DATA_SUCCESS:
            const currentDate = new Date();
            let dates = [];
            let values = [];

            for (let item of action.payload) {
                if (item === undefined) return;

                if (currentDate.getFullYear() - new Date(item[0]).getFullYear() >= 1
                    && currentDate.getMonth() === new Date(item[0]).getMonth()
                    && currentDate.getDate() === new Date(item[0]).getDate()) break;


                dates.unshift(new Date(item[0]).toLocaleDateString('en-GB', {
                    minute: '2-digit',
                    hour: '2-digit',
                    day : 'numeric',
                    month : 'short',
                    year : 'numeric'
                }));
                values.unshift(item[1]);
            }

            let lastTimeStamp = dates.shift();

            switch (action.period) {
                case '15m':
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleTimeString('en-GB',
                        { minute: '2-digit', hour: '2-digit' });
                    break;

                case '1h':
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleDateString('en-GB',
                        { weekday: 'short', minute: '2-digit', hour: '2-digit' });
                    break;

                case '6h':
                    lastTimeStamp = new Date(lastTimeStamp).toLocaleDateString('en-GB',
                        { minute: '2-digit', hour: '2-digit', day: '2-digit', month: 'short' });
                    break;

                case '1D':
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

        case BITFINEX_DATA_FAILURE:
            return {
                ...state,
                fetching: false,
                status: false,
                error: action.payload
            };

        case BITFINEX_DATA_CLEAR:
            return state = initialState;

        case BITFINEX_TICKERS_REQUEST:
            return {
                ...state,
                fetching: true,
                status: false
            };

        case BITFINEX_TICKERS_SUCCESS:
            const tickers = {};

            for (let value of action.payload) {
                tickers[value[0].substr(1, 3)] = value[1];
            }

            return {
                ...state,
                fetching: false,
                status: true,
                tickers: tickers
            };

        case BITFINEX_TICKERS_FAILURE:
            return {
                ...state,
                fetching: false,
                status: false,
                error: action.payload
            };

        default: return state;
    }
}