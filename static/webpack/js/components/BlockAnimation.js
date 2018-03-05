import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import { setSmooth, setSongName, setSongPlaying } from '../actions';
import { MUSIC_LIST, DARK_COLOR } from '../consts';

class BlockAnimationDumb extends React.Component {
  constructor(props) {
    super(props);
    this.sketch = this.sketch.bind(this);
  }

  componentDidMount() {
    if (this.p5Obj == null) this.p5Obj = new p5(this.sketch); // eslint-disable-line new-cap
  }

  componentWillUnmount() {
    if (this.p5Obj) {
      this.p5Obj.remove();
      this.p5Obj = null;
    }
  }

  sketch(p) {
    const {
        numBlock, song, storeSmooth, storeSongName, storeSongPlaying,
      } = this.props,
      marginRight = 210 + 20,
      marginTop = 70,
      previousH = {},
      masterParent = document.getElementById('block-animation');
    let { smooth } = this.props,
      angle = 0,
      sliderDragged = false,
      sliderReleased = true,
      x, z, ma, w, maxD, length, d, offset, a, h, pH,
      playButton, smoothCB, slider, selection, title;

    function setWindow() {
      length = p.floor(p.min(p.width, p.height));
      maxD = p.dist(0, 0, length * 0.8, length * 0.8);
      w = p.floor(length / numBlock);
      playButton.position(p.width - marginRight, marginTop);
      smoothCB.position((p.width - marginRight) + 80, marginTop + 10);
      slider.position((p.width - marginRight) + 80, marginTop + 40);
      selection.position(p.width - marginRight, marginTop + 80);
      title.position(
        (p.width - title.elt.clientWidth) / 2,
        (p.height - title.elt.clientHeight - 200) / 2,
      );
    }

    p.setup = () => {
      p.frameRate(60);
      const canvas = p.createCanvas(document.body.clientWidth, p.windowHeight * 0.95, p.WEBGL);
      canvas.parent(masterParent);
      canvas.id('blockAnim');
      playButton = p.createButton('');
      playButton.parent(masterParent);
      playButton.class('playButton');
      playButton.addClass('paused');
      playButton.mouseClicked(() => {
        storeSongPlaying(song.paused);
        if (song.paused) song.play();
        else song.pause();
      });

      smoothCB = p.createCheckbox();
      smoothCB.parent(masterParent);
      smoothCB.class('smoothCB pretty p-default');
      smoothCB.html("<div class='state'><label>Smooth</label></div>", true);
      smoothCB.checked(smooth);
      smoothCB.mouseClicked(() => { smooth = smoothCB.checked(); storeSmooth(smooth); });

      slider = p.createSlider(0, song.duration);
      slider.parent(masterParent);
      slider.class('slider');
      slider.changed(() => {
        song.currentTime = slider.value();
        sliderReleased = true;
      });
      slider.mousePressed(() => {
        sliderDragged = true;
        sliderReleased = false;
      });

      selection = p.createSelect();
      selection.parent(masterParent);
      selection.class('form-control form-control-sm selectBox');
      MUSIC_LIST.forEach((music) => {
        selection.option(music);
      });
      selection.changed(() => {
        const selected = selection.selected();
        song.songC = MUSIC_LIST.indexOf(selected);
        song.src = `/static/ml/music/${selected}.mp3`;
        storeSongName(selected);
      });

      title = p.createP(`Machine Learning &</br>Game Development
        </br>Prepare to be Amazed!`).center();
      title.parent(masterParent);
      title.class('display-3 title');

      ma = p.atan(1 / p.sqrt(2));
      setWindow();
    };

    p.draw = () => {
      p.background(DARK_COLOR);
      p.ortho(-p.width, p.width, p.height, -p.height, 0, p.width * 3);
      p.rotateX(ma);
      p.rotateY(-p.QUARTER_PI);
      p.normalMaterial();

      const isPlaying = !song.paused;
      for (z = -length / 2; z < length / 2; z += w) {
        for (x = -length / 2; x < length / 2; x += w) {
          p.push();
          d = p.dist(x, z, 0, 0);
          offset = p.map(d, 0, maxD, -p.PI, p.PI);
          a = angle + offset;
          if (isPlaying) {
            h = p.floor(p.map(
              p.sin(2 * a), -1, 1, length * 0.1,
              p.map((song.amp || 0), 0, 1, length * 0.1, length * 0.8),
            ));
          } else h = p.floor(p.map(p.sin(2 * a), -1, 1, length * 0.1, length * 0.5));
          if (smooth) {
            pH = (previousH[x] && previousH[x][z]) || length * 0.1;
            h = pH + p.map((h - pH), -50, 50, -length * 0.02, length * 0.02);
          }
          p.translate(x, -p.height / 4, z);
          p.fill(182, 159, 102);
          p.box(w - 1, h, w);
          p.translate(w / 2, -1, -1);
          p.fill(228, 218, 165);
          p.box(1, h, w);
          p.translate(-w / 2, (h / 2) + 1, 1);
          p.fill(172, 229, 123);
          p.box(w, 3, w);
          p.pop();
          previousH[x] = previousH[x] || {};
          previousH[x][z] = h;
        }
      }
      if (isPlaying) {
        angle -= 0.07;
        playButton.class('playButton paused');
        selection.selected(MUSIC_LIST[song.songC]);

        if (!sliderDragged) {
          slider.attribute('max', song.duration);
          slider.value(song.currentTime);
        }
        if (sliderReleased) sliderDragged = false;
      } else {
        angle -= 0.02;
        playButton.class('playButton');
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(document.body.clientWidth, p.windowHeight * 0.9);
      setWindow();
    };
  }

  render() {
    return <div id="block-animation" />;
  }
}

BlockAnimationDumb.propTypes = {
  numBlock: PropTypes.number,
  smooth: PropTypes.bool.isRequired,
  song: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  storeSmooth: PropTypes.func.isRequired,
  storeSongName: PropTypes.func.isRequired,
  storeSongPlaying: PropTypes.func.isRequired,
};

BlockAnimationDumb.defaultProps = {
  numBlock: 14,
};

const mapStateToProps = state => ({
    song: state.blockAnimation.song,
    smooth: state.blockAnimation.smooth,
  }),
  mapDispatchToProps = dispatch => ({
    storeSmooth: smooth => dispatch(setSmooth(smooth)),
    storeSongName: songName => dispatch(setSongName(songName)),
    storeSongPlaying: songPlaying => dispatch(setSongPlaying(songPlaying)),
  }),
  BlockAnimation = connect(mapStateToProps, mapDispatchToProps)(BlockAnimationDumb);

export default BlockAnimation;
