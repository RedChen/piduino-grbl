import { combineReducers } from 'redux';
import gcode from './gcode';
import console from './console';

export default combineReducers({
    gcode,
    console
});
