import { CURRENCY_CHANGE } from '../constants/types';

export function changeCurrency(currency) {
    return {
        type: CURRENCY_CHANGE,
        payload: currency
    }
}