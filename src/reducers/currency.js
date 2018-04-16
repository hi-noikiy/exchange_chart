import { CURRENCY_CHANGE } from '../constants/types';

const initialState = { name: 'BTC' };

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case CURRENCY_CHANGE:
            return {
                ...state,
                name: action.payload
            };

        default: return state;
    }
}