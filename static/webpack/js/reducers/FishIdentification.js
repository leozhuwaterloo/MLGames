import { SET_PREDICT, SET_FISH_LIST } from '../actions';

const initialState = {
  predict: {
    1: {
      speciesname: '',
      genusname: '',
      confidence: 0,
    },
    2: {
      peciesname: '',
      genusname: '',
      confidence: 0,
    },
    3: {
      peciesname: '',
      genusname: '',
      confidence: 0,
    },
  },
  fishList: {},
};

export default function fishIdentification(state = initialState, action) {
  switch (action.type) {
    case SET_PREDICT:
      return Object.assign({}, state, {
        predict: action.predict,
      });
    case SET_FISH_LIST:
      return Object.assign({}, state, {
        fishList: action.fishList,
      });
    default:
      return state;
  }
}
