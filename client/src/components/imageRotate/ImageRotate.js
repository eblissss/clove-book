// dependencies
import React from 'react';
import PropTypes from 'prop-types';
import BgImage from "../../assets/clove3d.png";
const hiddenStyle = {
  display: 'hidden',
};

class ImageRotate extends React.Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
  }
  
  state = {
	  speed: 3,
    file: null,
    degrees: 0,
  }

  render() {
    const { file } = {BgImage};
    
    return (
      <div>
        <img src={file} alt="" />
      </div>
    );
  }
}

export default ImageRotate;
