import React from 'react';
import 'normalize.css';
import { BrowserRouter, Route } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import BlockAnimation from './components/BlockAnimation';
import FishIdentifier from './components/FishIdentifier';
import '../css/style.scss';

class AppRounter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <MyNavbar />
          <Route exact path="/ml/" component={BlockAnimation} />
          <Route path="/ml/fish-identifier" component={FishIdentifier} />
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRounter;
