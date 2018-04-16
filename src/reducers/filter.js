import { FILTER_SWITCH } from '../constants/types';

const initialState = { name: 'day' };

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case FILTER_SWITCH:
            return {
                ...state,
                name: action.payload
            };

        default: return state;
    }
}