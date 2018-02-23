import React from 'react';
import P5Wrapper from './P5Wrapper.js';
import p5 from 'p5';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';

class BlockAnimation extends React.Component {
  constructor(props){
    super(props);
    // We dont need to use state here
    this.numBlock = props.numBlock || 14;
    this.smooth = props.smooth || true;
    this.songC = props.songC && props.songC - 1 || -1;

    this.slider_dragged = false;
    this.slider_released = true;
    this.margin_right = 210 + 20;
    this.musicList = ["Aperture", "Arrow", "Cloud-9", "Firefly", "Frag-Out", "Good-Times",
      "Hope", "Lights", "Lush", "Me-You", "Oblivion", "Paradise", "Run-Away", "Sound-of-Goodbye",
      "The-Long-Road-Home", "Vitality"];
    this.sketch = this.sketch.bind(this);
  }

  sketch(p){
    const _this = this;
    let angle = 0;
    let ma, w, maxD, length;
    let d, offset, a, h, pH, previousH = {};
    let songC = _this.songC;
    let song, amplitude, playButton, smoothCB, slider, selection, title;

    p.preload = function(){
      p.loadSong();
    }

    p.setWindow = function() {
      length = p.floor(p.min(p.width, p.height));
      maxD = p.dist(0, 0, length * 0.8, length * 0.8);
      w = p.floor(length/_this.numBlock);
      playButton.position(p.width - _this.margin_right, 20);
      smoothCB.position(p.width - _this.margin_right +  80, 20 + 10);
      slider.position(p.width - _this.margin_right + 80, 20 + 40);
      selection.position(p.width - _this.margin_right, 20 + 80);
      title.position(p.width / 2 - title.elt.clientWidth / 2, p.height/2 - title.elt.clientHeight / 2);
    }

    p.loadSong = function(callback, songName){
      if(song) song.disconnect();
      if(slider) slider.attribute('disabled', '');
      if(playButton) playButton.attribute('disabled', '');
      if(selection) selection.attribute('disabled', '');

      if (songName){
        songC = _this.musicList.indexOf(songName);
        song = p.loadSound("/static/ml/music/{0}.mp3".format(songName), callback);
      } else {
        ++songC;
        if(songC >= _this.musicList.length) songC -= _this.musicList.length;
        song = p.loadSound("/static/ml/music/{0}.mp3".format(_this.musicList[songC]), callback);
      }
    }

    p.songEnded = function(){
      if (p.abs(song.currentTime() - song.duration()) < 0.1 || song.currentTime() == 0){
        p.switchSong();
      }
    }

    p.switchSong = function(songName){
      console.log("Switching for new song");
      p.loadSong(() => {
        song.onended(p.songEnded);
        song.play();
        slider.attribute("max", song.duration());
        slider.removeAttribute('disabled');
        playButton.removeAttribute('disabled');
        selection.removeAttribute('disabled');
        selection.selected(_this.musicList[songC]);
      }, songName);
    }

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight * 0.95, p.WEBGL);
      playButton = p.createButton('');
      playButton.class("playButton");
      playButton.addClass("paused");
      playButton.mouseClicked(() => {
        if (song.isPlaying()) song.pause();
        else song.play();
      });

      smoothCB = p.createCheckbox();
      smoothCB.class("smoothCB pretty p-default");
      smoothCB.html('<div class="state"><label>Smooth</label></div>', true);
      smoothCB.checked(_this.smooth);
      smoothCB.mouseClicked(() => _this.smooth = smoothCB.checked());

      slider = p.createSlider(0, song.duration());
      slider.class("slider");
      slider.changed(() => {
        song.jump(slider.value());
        _this.slider_released = true;
      });
      slider.mousePressed(() => {
        _this.slider_dragged = true;
        _this.slider_released = false;
      });

      selection = p.createSelect();
      selection.class("form-control form-control-sm selectBox");
      _this.musicList.forEach((music) => {
        selection.option(music);
      });
      selection.changed(() => p.switchSong(selection.selected()));


      title = p.createP("Machine Learning &</br>Game Development</br>Prepare to be Amazed!").center();
      title.class("display-3 title");


      ma = p.atan(1 / p.sqrt(2));
      amplitude = new p5.Amplitude();
      song.onended(p.songEnded);
      song.play();

      p.setWindow();
    };



    p.draw = function() {
      p.background(34,34,34);
      p.ortho(-p.width, p.width, p.height, -p.height, 0, p.width * 3);
      p.rotateX(ma);
      p.rotateY(-p.QUARTER_PI);
      p.normalMaterial();

      const isPlaying = song.isPlaying();
      for(let z = -length / 2; z < length /2; z += w) {
        for(let x = -length / 2; x < length/2; x += w) {
          p.push();
          d = p.dist(x, z, 0, 0);
          offset = p.map(d, 0, maxD, -p.PI, p.PI);
          a = angle + offset;
          if(isPlaying) h = p.floor(p.map(p.sin(2 * a), -1, 1, length * 0.1, p.map(amplitude.getLevel(), 0, 1, length * 0.1, length * 0.8)));
          else h = p.floor(p.map(p.sin(2 * a), -1, 1, length * 0.1, length * 0.5));
          if(_this.smooth){
            pH = previousH[x] && previousH[x][z] || length * 0.1;
            h = pH + p.map((h - pH), -50, 50, -length * 0.02, length * 0.02);
          }
          p.translate(x, -p.height/4, z);
          p.fill(182,159,102);
          p.box(w-1, h, w);
          p.translate(w/2, -1, -1);
          p.fill(228,218,165);
          p.box(1, h, w);
          p.translate(-w/2 , h/2 + 1, 1);
          p.fill(172, 229, 123);
          p.box(w, 1, w);
          p.pop();
          previousH[x] = previousH[x] || {};
          previousH[x][z] = h;
        }
      }
      if(isPlaying){
        angle -= 0.07;
        playButton.class("playButton paused");
        if(song.currentTime() != 0){
          if(!_this.slider_dragged) slider.value(song.currentTime());
          if(_this.slider_released) _this.slider_dragged = false;
        }
      } else{
        angle -= 0.02;
        playButton.class("playButton");
      }

    };

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight * 0.95);
      p.setWindow();
    }
  }

  render() {
    return (
      <div>
        <P5Wrapper sketch={this.sketch}/>
      </div>
    );
  }
}

export default BlockAnimation;
