import React from 'react';
import PropTypes from 'prop-types';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { connect } from 'react-redux';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';
import { DARK_COLOR } from '../consts';

class TerrainGenerationDumb extends React.Component {
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
    const { song } = this.props,
      scl = 20,
      w = 1200,
      h = 1200,
      amp = {},
      masterParent = document.getElementById('terrain-generation');
    let cols,
      rows,
      terrain = null,
      xoff,
      yoff,
      flying = 0,
      ampC = 0,
      ampP,
      ampD,
      allowD,
      channelTotal,
      followSong = false,
      followSongCB;

    function setWindow() {
      followSongCB.position((p.windowWidth / 2) - 48, p.windowHeight * 0.15);
    }

    p.setup = () => {
      const canvas = p.createCanvas(600, 600, p.WEBGL);
      canvas.parent(masterParent);
      p.frameRate(60);
      cols = w / scl;
      rows = h / scl;
      terrain = new Array(cols);
      for (let x = 0; x < cols; x += 1) {
        terrain[x] = new Array(rows);
      }

      followSongCB = p.createCheckbox();
      followSongCB.parent(masterParent);
      followSongCB.class('smoothCB pretty p-default');
      followSongCB.html("<div class='state'><label>Follow Song</label></div>", true);
      followSongCB.checked(followSong);
      followSongCB.mouseClicked(() => { followSong = followSongCB.checked(); });
      setWindow();
    };

    p.draw = () => {
      yoff = flying;
      ampP = ampC;
      amp[ampP] = [];
      if (followSong && song.channel) {
        for (let x = 0; x < cols; x += 1) {
          channelTotal = 0;
          for (let i = 34 * x; i < 34 * (x + 1); i += 1) {
            channelTotal += song.channel[i];
          }
          amp[ampP].push(p.map(channelTotal / 34, 0, 1, 0, 3));
        }
        if (amp[ampP + 1]) {
          for (let x = 0; x < cols; x += 1) {
            if (amp[ampP][x] - amp[ampP + 1][x] < 0) allowD = p.random(0, 0.2);
            else allowD = p.random(0, 1);
            amp[ampP][x] = amp[ampP + 1][x] + p.map(amp[ampP][x] - amp[ampP + 1][x], -1, 1, -allowD, allowD);
          }
        }
      } else {
        for (let x = 0; x < cols; x += 1) {
          amp[ampP][x] = 1;
        }
      }

      for (let y = 0; y < rows; y += 1) {
        xoff = 0;
        for (let x = 0; x < cols; x += 1) {
          ampD = (amp[ampP] && amp[ampP][x]) || 0;
          terrain[x][y] = p.map(p.noise(xoff, yoff), 0, 1, -80 * ampD, 80 * ampD);
          xoff += 0.2;
        }
        ampP += 1;
        yoff += 0.08;
      }
      ampC -= 1;


      p.background(DARK_COLOR);
      p.stroke(255);
      p.noFill();

      p.rotateX(p.PI / 3);
      p.translate(-w / 2, -(h / 2) - 200);

      for (let y = 0; y < rows - 1; y += 1) {
        p.beginShape(p.TRIANGLE_STRIP);
        for (let x = 0; x < cols; x += 1) {
          p.vertex(x * scl, y * scl, terrain[x][y]);
          p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
        }
        p.endShape();
      }

      flying -= 0.08;
    };

    p.windowResized = () => {
      setWindow();
    };
  }

  render() {
    return (
      <div id="terrain-generation" className="center-display full-screen theme-dark" />
    );
  }
}

TerrainGenerationDumb.propTypes = {
  song: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
    song: state.blockAnimation.song,
  }),
  TerrainGeneration = connect(mapStateToProps)(TerrainGenerationDumb);

export default TerrainGeneration;
