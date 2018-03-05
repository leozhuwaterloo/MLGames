import { combineReducers } from 'redux';
import blockAnimation from './BlockAnimation';
import fishIdentification from './FishIdentification';

export default combineReducers({
  blockAnimation,
  fishIdentification,
});
