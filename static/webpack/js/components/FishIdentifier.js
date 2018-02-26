import React from 'react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  GooglePlusShareButton, GooglePlusIcon,
} from 'react-share';
import 'bootstrap/js/dist/carousel';
import { IMAGE_URL } from '../consts';

class FishIdentifier extends React.Component {
  constructor(props) {
    super(props);
    this.test = 1;
  }

  render() {
    return (
      <div className="container-fluid main-container">
        <div className="content-start center-display">
          <div className="share-buttons">
            <FacebookShareButton
              className="sp-btn btn-1 center-display"
              url={window.location.href}
              quote="Fish identification with deep learning"
            >
              <FacebookIcon />
              <span>Share on facebook</span>
            </FacebookShareButton>
            <TwitterShareButton
              className="sp-btn btn-1 center-display"
              url={window.location.href}
              title="Computer can now identify fish from a picture!"
            >
              <TwitterIcon />
              <span>Twitte about it</span>
            </TwitterShareButton>
            <GooglePlusShareButton
              className="sp-btn btn-1 center-display"
              url={window.location.href}
            >
              <GooglePlusIcon />
              <span>What&apos;s on your mind?</span>
            </GooglePlusShareButton>
          </div>
        </div>
        <div className="content-main center-display">
          <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active" />
              <li data-target="#carouselExampleIndicators" data-slide-to="1" />
              <li data-target="#carouselExampleIndicators" data-slide-to="2" />
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img className="d-block w-100" src={`${IMAGE_URL}/fish.jpg`} alt="First slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src={`${IMAGE_URL}/fish.jpg`} alt="Second slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src={`${IMAGE_URL}/fish.jpg`} alt="Third slide" />
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
        <div className="contend-end center-display">
          Proudly Made by Leo Zhu
        </div>
      </div>
    );
  }
}

export default FishIdentifier;
