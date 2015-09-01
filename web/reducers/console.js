import { CONSOLE_SEND, CONSOLE_CLEARALL } from '../actions';

export default function console(state = '', action) {
    switch (action.type) {
        case CONSOLE_SEND:
            return action.command;
        case CONSOLE_CLEARALL:
            return '';
        default:
            return state;
    }
}
