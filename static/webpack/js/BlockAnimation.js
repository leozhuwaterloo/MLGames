import React from 'react';
import P5Wrapper from './P5Wrapper.js';
import p5 from 'p5';

class BlockAnimation extends React.Component {
  constructor(props){
    super(props);
  }

  sketch(p){
    const numBlock = 14;
    let angle = 0;
    let ma, w, maxD, length;
    let song, amplitude, button;

    p.preload = function(){
      song = p.loadSound("/static/ml/music/HYLO.mp3");
    }

    p.setWindow = function() {
      length = p.floor(p.min(p.width, p.height));
      maxD = p.dist(0, 0, length * 0.8, length * 0.8);
      w = p.floor(length/numBlock)
      button.position(p.width - 100, 19);
    }

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight * 0.95, p.WEBGL);
      button = p.createButton('');
      button.class("playButton");
      button.addClass("paused");
      button.mousePressed(() => {
        if (song.isPlaying()){
          song.pause();
          button.removeClass("paused");
        } else {
          song.play();
          button.addClass("paused");
        }
      });

      ma = p.atan(1 / p.sqrt(2));
      p.setWindow();
      amplitude = new p5.Amplitude();
      song.loop();
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
          let d = p.dist(x, z, 0, 0);
          let offset = p.map(d, 0, maxD, -p.PI, p.PI);
          let a = angle + offset;
          let h;
          if(isPlaying) h = p.floor(p.map(p.sin(2 * a), -1, 1, length * 0.1, p.map(amplitude.getLevel(), 0, 1, length * 0.1, length * 0.8)));
          else h = p.floor(p.map(p.sin(2 * a), -1, 1, length * 0.1, length * 0.5));

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
        }
      }
      if(isPlaying) angle -= 0.07;
      else angle -= 0.02;
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
