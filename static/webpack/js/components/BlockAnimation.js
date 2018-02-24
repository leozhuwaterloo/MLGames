import React from 'react';
import PropTypes from 'prop-types';
import p5 from 'p5';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import P5Wrapper from './P5Wrapper';

class BlockAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.sketch = this.sketch.bind(this);
  }

  sketch(p) {
    const { numBlock } = this.props,
      marginRight = 210 + 20,
      marginTop = 70,
      musicList = ['Aperture', 'Arrow', 'Cloud-9', 'Firefly', 'Frag-Out',
        'Good-Times', 'Hope', 'Lights', 'Lush', 'Me-You', 'Oblivion', 'Paradise',
        'Run-Away', 'Sound-of-Goodbye', 'The-Long-Road-Home', 'Vitality'],
      previousH = {};
    let { smooth, startSong: songC } = this.props,
      angle = 0,
      sliderDragged = false,
      sliderReleased = true,
      x, z, ma, w, maxD, length, d, offset, a, h, pH, song, amplitude,
      canvas, playButton, smoothCB, slider, selection, title;

    p.preload = () => {
      songC -= 1;
      p.loadSong();
    };

    p.setWindow = () => {
      length = p.floor(p.min(p.width, p.height));
      maxD = p.dist(0, 0, length * 0.8, length * 0.8);
      w = p.floor(length / numBlock);
      playButton.position(p.width - marginRight, marginTop);
      smoothCB.position((p.width - marginRight) + 80, marginTop + 10);
      slider.position((p.width - marginRight) + 80, marginTop + 40);
      selection.position(p.width - marginRight, marginTop + 80);
      title.position(
        (p.width - title.elt.clientWidth) / 2,
        (p.height - title.elt.clientHeight) / 2,
      );
    };

    p.loadSong = (callback, songName) => {
      if (song) song.disconnect();
      if (slider) slider.attribute('disabled', '');
      if (playButton) playButton.attribute('disabled', '');
      if (selection) selection.attribute('disabled', '');

      if (songName) {
        songC = musicList.indexOf(songName);
        song = p.loadSound(`/static/ml/music/${songName}.mp3`, callback);
      } else {
        songC += 1;
        if (songC >= musicList.length) songC -= musicList.length;
        song = p.loadSound(`/static/ml/music/${musicList[songC]}.mp3`, callback);
      }
    };

    p.songEnded = () => {
      if (p.abs(song.currentTime() - song.duration()) < 0.1 || song.currentTime() === 0) {
        p.switchSong();
      }
    };

    p.switchSong = (songName) => {
      console.log('Switching for new song');
      p.loadSong(() => {
        song.onended(p.songEnded);
        song.play();
        slider.attribute('max', song.duration());
        slider.removeAttribute('disabled');
        playButton.removeAttribute('disabled');
        selection.removeAttribute('disabled');
        selection.selected(musicList[songC]);
      }, songName);
    };

    p.setup = () => {
      canvas = p.createCanvas(document.body.clientWidth, p.windowHeight * 0.9, p.WEBGL);
      canvas.id('blockAnim');
      playButton = p.createButton('');
      playButton.class('playButton');
      playButton.addClass('paused');
      playButton.mouseClicked(() => {
        if (song.isPlaying()) song.pause();
        else song.play();
      });

      smoothCB = p.createCheckbox();
      smoothCB.class('smoothCB pretty p-default');
      smoothCB.html("<div class='state'><label>Smooth</label></div>", true);
      smoothCB.checked(smooth);
      smoothCB.mouseClicked(() => { smooth = smoothCB.checked(); });

      slider = p.createSlider(0, song.duration());
      slider.class('slider');
      slider.changed(() => {
        song.jump(slider.value());
        sliderReleased = true;
      });
      slider.mousePressed(() => {
        sliderDragged = true;
        sliderReleased = false;
      });

      selection = p.createSelect();
      selection.class('form-control form-control-sm selectBox');
      musicList.forEach((music) => {
        selection.option(music);
      });
      selection.changed(() => p.switchSong(selection.selected()));


      title = p.createP(`Machine Learning &</br>Game Development
        </br>Prepare to be Amazed!`).center();
      title.class('display-3 title');


      ma = p.atan(1 / p.sqrt(2));
      amplitude = new p5.Amplitude();
      song.onended(p.songEnded);
      song.play();

      p.setWindow();
    };

    p.draw = () => {
      p.background('#343a40');
      p.ortho(-p.width, p.width, p.height, -p.height, 0, p.width * 3);
      p.rotateX(ma);
      p.rotateY(-p.QUARTER_PI);
      p.normalMaterial();

      const isPlaying = song.isPlaying();
      for (z = -length / 2; z < length / 2; z += w) {
        for (x = -length / 2; x < length / 2; x += w) {
          p.push();
          d = p.dist(x, z, 0, 0);
          offset = p.map(d, 0, maxD, -p.PI, p.PI);
          a = angle + offset;
          if (isPlaying) {
            h = p.floor(p.map(
              p.sin(2 * a), -1, 1, length * 0.1,
              p.map(amplitude.getLevel(), 0, 1, length * 0.1, length * 0.8),
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
        if (song.currentTime() !== 0) {
          if (!sliderDragged) slider.value(song.currentTime());
          if (sliderReleased) sliderDragged = false;
        }
      } else {
        angle -= 0.02;
        playButton.class('playButton');
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(document.body.clientWidth, p.windowHeight * 0.9);
      p.setWindow();
    };
  }

  render() {
    return (
      <div>
        <P5Wrapper sketch={this.sketch} />
      </div>
    );
  }
}

BlockAnimation.propTypes = {
  numBlock: PropTypes.number,
  smooth: PropTypes.bool,
  startSong: PropTypes.number,
};


BlockAnimation.defaultProps = {
  numBlock: 14,
  smooth: true,
  startSong: 0,
};

export default BlockAnimation;
