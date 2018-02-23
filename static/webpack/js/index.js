import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BlockAnimation from './BlockAnimation.js';
import FishIdentifier from './FishIdentifier.js';
import '../css/style.scss'

class App extends React.Component {
  constructor(props) {
    super(props);
    String.prototype.format = function() {
      let a = this;
      for (let k in arguments) {
        a = a.replace("{" + k + "}", arguments[k]);
      }
      return a;
    }
  }

  render() {
    return (
      <div>
        <BlockAnimation/>
        <FishIdentifier/>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('react-app'));
