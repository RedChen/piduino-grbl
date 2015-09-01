import { GCODE_UPDATE } from '../actions';

const defaultState = {
    data: []
};

export default function gcode(state = defaultState, action) {
    switch (action.type) {
        case GCODE_UPDATE:
            return {
                data: action.data
            };
        default:
            return state;
    }
}
