export const SET_PREDICT = 'SET_PREDICT',
  SET_FISH_LIST = 'SET_FISH_LIST';

export function setPredict(predict) {
  return { type: SET_PREDICT, predict };
}

export function setFishList(fishList) {
  return { type: SET_FISH_LIST, fishList };
}
