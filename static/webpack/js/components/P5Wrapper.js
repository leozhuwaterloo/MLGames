/* eslint new-cap: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

class P5Wrapper extends React.Component {
  componentDidMount() {
    this.canvas = new p5(this.props.sketch || null, this.wrapper);
  }

  render() {
    return <div ref={(wrapper) => { this.wrapper = wrapper; }} />;
  }
}


P5Wrapper.propTypes = {
  sketch: PropTypes.func.isRequired,
};

export default P5Wrapper;
