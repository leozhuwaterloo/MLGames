import React from 'react';
import ReactDOM from 'react-dom';
import BlockAnimation from './BlockAnimation.js';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BlockAnimation/>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('react-app'));
