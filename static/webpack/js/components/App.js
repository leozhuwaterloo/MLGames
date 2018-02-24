import React from 'react';
import PropTypes from 'prop-types';
import 'normalize.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MyNavbar from './MyNavbar';
import BlockSongAnimation from './BlockSongAnimation';
import FishIdentifier from './FishIdentifier';
import '../../css/style.scss';
import { setSong } from '../actions';
import { MUSIC_LIST, ROOT_URL, FISH_IDENTIFICATION_URL } from '../consts';

class AppRounter extends React.Component {
  componentWillMount() {
    const { storeSong } = this.props,
      ctx = new AudioContext(),
      processor = ctx.createScriptProcessor(256, 1, 1),
      audio = new Audio(`/static/ml/music/${MUSIC_LIST[0]}.mp3`),
      source = ctx.createMediaElementSource(audio);

    audio.songC = 0;
    source.connect(processor);
    source.connect(ctx.destination);
    processor.connect(ctx.destination);

    processor.onaudioprocess = (evt) => {
      const input = evt.inputBuffer.getChannelData(0),
        len = input.length;
      let total = 0,
        i;
      for (i = 0; i < len; i += 1) {
        total += Math.abs(input[i]);
      }
      audio.amp = Math.sqrt(total / len);
    };

    audio.onended = () => {
      audio.songC += 1;
      if (audio.songC >= MUSIC_LIST.length) audio.songC -= MUSIC_LIST.length;
      audio.src = `/static/ml/music/${MUSIC_LIST[audio.songC]}.mp3`;
    };

    audio.oncanplay = () => {
      audio.play();
    };

    storeSong(audio);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <MyNavbar />
          <Route exact path={ROOT_URL} component={BlockSongAnimation} />
          <Route path={FISH_IDENTIFICATION_URL} component={FishIdentifier} />
        </div>
      </BrowserRouter>
    );
  }
}


AppRounter.propTypes = {
  storeSong: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    storeSong: song => dispatch(setSong(song)),
  }),
  App = connect(null, mapDispatchToProps)(AppRounter);

export default App;
