import React from 'react';
import p5 from 'p5';

function sketch(p) {
  const masterParent = document.getElementById('photo-mosaic');

  p.setup = () => {
    const canvas = p.createCanvas(600, 600);
    canvas.parent(masterParent);
  };

  p.draw = () => {
    p.background(0);
  };
}


class PhotoMosaic extends React.Component {
  constructor(props) {
    super(props);
    this.test = 1;
  }

  componentDidMount() {
    if (this.p5Obj == null) this.p5Obj = new p5(sketch); // eslint-disable-line new-cap
  }

  componentWillUnmount() {
    if (this.p5Obj) {
      this.p5Obj.remove();
      this.p5Obj = null;
    }
  }

  render() {
    return (
      <div id="photo-mosaic" className="center-display full-screen theme-dark" />
    );
  }
}

export default PhotoMosaic;
