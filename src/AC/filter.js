import { FILTER_SWITCH } from '../constants/types';

export function filterSwitch(filter) {
    return {
        type: FILTER_SWITCH,
        payload: filter
    }
}