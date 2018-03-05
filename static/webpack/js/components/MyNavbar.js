import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import {
  ROOT_URL, FISH_IDENTIFICATION_URL, TERRAIN_GENERATION_URL, SMART_ROCKET_URL,
  PHOTO_MOSAIC_URL,
} from '../consts';
import { setSongPlaying } from '../actions';

const MyNavbarDumb = ({
    song, songName, songPlaying, storeSongPlaying,
  }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <Link className="navbar-brand" to={ROOT_URL}>Home</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="http://leozhu.org/">My Portfolio</a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#dropdown"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
            Projects
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <div className="dropdown-submenu">
                <div className="dropdown-item">Machine Learning</div>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="http://leozhu.org/pages/mnist-detail/">Handwritten Digit</a>
                  <Link className="dropdown-item" to={SMART_ROCKET_URL}>
                    Smart Rocket
                  </Link>
                  <Link className="dropdown-item" to={FISH_IDENTIFICATION_URL}>
                    Fish Identification
                  </Link>
                </div>
              </div>
              <div className="dropdown-submenu">
                <div className="dropdown-item">Algorithum</div>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to={TERRAIN_GENERATION_URL}>
                    Terrain Generation
                  </Link>
                  <Link className="dropdown-item" to={PHOTO_MOSAIC_URL}>
                    Photo Mosaic
                  </Link>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <button
          className="btn btn-outline-light my-2 my-sm-0"
          style={{ marginRight: '10px' }}
          type="submit"
          onClick={() => {
              if (songPlaying) song.pause(); else song.play();
              storeSongPlaying(!songPlaying);
            }
          }
        >
          {songPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="navbar-text">
          Now playing {songName} ...
        </span>
      </div>
    </nav>
  ),
  mapStateToProps = state => ({
    song: state.blockAnimation.song,
    songName: state.blockAnimation.songName,
    songPlaying: state.blockAnimation.songPlaying,
  }),
  mapDispatchToProps = dispatch => ({
    storeSongPlaying: songPlaying => dispatch(setSongPlaying(songPlaying)),
  }),
  MyNavbar = connect(mapStateToProps, mapDispatchToProps)(MyNavbarDumb);

MyNavbarDumb.propTypes = {
  song: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  songName: PropTypes.string.isRequired,
  songPlaying: PropTypes.bool.isRequired,
  storeSongPlaying: PropTypes.func.isRequired,
};


export default MyNavbar;
