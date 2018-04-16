import { EXCHANGE_SWITCH } from '../constants/types';

const initialState = { name: 'bitfinex' };

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case EXCHANGE_SWITCH:
            return {
                ...state,
                name: action.payload
            };

        default: return state;
    }
}