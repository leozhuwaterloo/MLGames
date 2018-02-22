import React from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound.js';
import 'p5/lib/addons/p5.dom.js';

export default class P5Wrapper extends React.Component {
  componentDidMount() {
    this.canvas = new p5(this.props.sketch, this.wrapper);
  }

  render() {
    return <div ref={wrapper => this.wrapper = wrapper}></div>;
  }
}
