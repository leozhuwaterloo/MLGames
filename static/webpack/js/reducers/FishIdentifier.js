import { SET_PREDICT } from '../actions';

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
};

export default function fishIdentifier(state = initialState, action) {
  switch (action.type) {
    case SET_PREDICT:
      return Object.assign({}, state, {
        predict: action.predict,
      });
    default:
      return state;
  }
}
