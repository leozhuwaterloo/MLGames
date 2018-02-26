export const SET_SONG = 'SET_SONG',
  SET_SMOOTH = 'SET_SMOOTH',
  SET_SONG_NAME = 'SET_SONG_NAME',
  SET_SONG_PLAYING = 'SET_SONG_PLAYING';

export function setSong(song) {
  return { type: SET_SONG, song };
}

export function setSmooth(smooth) {
  return { type: SET_SMOOTH, smooth };
}

export function setSongName(songName) {
  return { type: SET_SONG_NAME, songName };
}

export function setSongPlaying(songPlaying) {
  return { type: SET_SONG_PLAYING, songPlaying };
}
