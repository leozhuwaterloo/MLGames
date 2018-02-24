import { combineReducers } from 'redux';
import { SET_SONG, SET_SMOOTH } from '../actions';

const initialState = {
  song: null,
  smooth: true,
};

function blockAnimation(state = initialState, action) {
  switch (action.type) {
    case SET_SONG:
      return Object.assign({}, state, {
        song: action.song,
      });
    case SET_SMOOTH:
      return Object.assign({}, state, {
        smooth: action.smooth,
      });
    default:
      return state;
  }
}

export default combineReducers({
  blockAnimation,
});
