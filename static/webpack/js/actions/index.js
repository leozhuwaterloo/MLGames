export const SET_SONG = 'SET_SONG',
  SET_SMOOTH = 'SET_SMOOTH';

export function setSong(song) {
  return { type: SET_SONG, song };
}

export function setSmooth(smooth) {
  return { type: SET_SMOOTH, smooth };
}
