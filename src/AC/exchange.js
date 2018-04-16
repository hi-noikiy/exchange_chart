import { EXCHANGE_SWITCH } from '../constants/types';

export function exchangeSwitch(name) {
    return {
        type: EXCHANGE_SWITCH,
        payload: name
    }
}