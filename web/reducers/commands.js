import { UPDATE_COMMANDS } from '../actions';

export default function commands(state = [], action) {
    switch (action.type) {
        case UPDATE_COMMANDS:
            return action.commands;
        default:
            return state;
    }
}
