import { combineReducers } from 'redux';
import {
  SET_SONG,
  SET_SMOOTH,
  SET_SONG_NAME,
  SET_SONG_PLAYING,
} from '../actions';

const initialState = {
  song: null,
  smooth: true,
  songName: '',
  songPlaying: false,
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
    case SET_SONG_NAME:
      return Object.assign({}, state, {
        songName: action.songName,
      });
    case SET_SONG_PLAYING:
      return Object.assign({}, state, {
        songPlaying: action.songPlaying,
      });
    default:
      return state;
  }
}

export default combineReducers({
  blockAnimation,
});
