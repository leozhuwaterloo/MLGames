import React from 'react';
import PropTypes from 'prop-types';
import 'normalize.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MyNavbar from './MyNavbar';
import BlockAnimation from './BlockAnimation';
import FishIdentification from './FishIdentification';
import TerrainGeneration from './TerrainGeneration';
import SmartRocket from './SmartRocket';
import PhotoMosaic from './PhotoMosaic';
import { setSong, setSongName, setSongPlaying } from '../actions';
import {
  MUSIC_LIST, ROOT_URL, FISH_IDENTIFICATION_URL, TERRAIN_GENERATION_URL,
  SMART_ROCKET_URL, PHOTO_MOSAIC_URL,
} from '../consts';
import '../../css/style.scss';

class AppRounter extends React.Component {
  constructor(props) {
    super(props);
    this.autoPlayMusic = false;
  }

  componentWillMount() {
    const { storeSong, storeSongName, storeSongPlaying } = this.props,
      ctx = new AudioContext(),
      processor = ctx.createScriptProcessor(2048, 1, 1),
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
      audio.channel = input;
    };

    audio.onended = () => {
      audio.songC += 1;
      if (audio.songC >= MUSIC_LIST.length) audio.songC -= MUSIC_LIST.length;
      audio.src = `/static/ml/music/${MUSIC_LIST[audio.songC]}.mp3`;
      storeSongName(MUSIC_LIST[audio.songC]);
    };

    audio.oncanplay = () => {
      if (this.autoPlayMusic) audio.play(); else audio.pause();
      storeSongPlaying(!audio.paused);
    };

    storeSongName(MUSIC_LIST[0]);
    storeSong(audio);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <MyNavbar />
          <Route exact path={ROOT_URL} component={BlockAnimation} />
          <Route path={FISH_IDENTIFICATION_URL} component={FishIdentification} />
          <Route path={TERRAIN_GENERATION_URL} component={TerrainGeneration} />
          <Route path={SMART_ROCKET_URL} component={SmartRocket} />
          <Route path={PHOTO_MOSAIC_URL} component={PhotoMosaic} />
        </div>
      </BrowserRouter>
    );
  }
}


AppRounter.propTypes = {
  storeSong: PropTypes.func.isRequired,
  storeSongName: PropTypes.func.isRequired,
  storeSongPlaying: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    storeSong: song => dispatch(setSong(song)),
    storeSongName: songName => dispatch(setSongName(songName)),
    storeSongPlaying: songPlaying => dispatch(setSongPlaying(songPlaying)),
  }),
  App = connect(null, mapDispatchToProps)(AppRounter);

export default App;
