import React from 'react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  GooglePlusShareButton, GooglePlusIcon,
} from 'react-share';
import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import { IMAGE_URL } from '../consts';

class FishIdentifier extends React.Component {
  constructor(props) {
    super(props);
    this.test = 1;
    this.predict = this.predict.bind(this);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === ('csrftoken=')) {
          this.csrftoken = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
  }

  componentDidMount() {
    const $carousel = $('.carousel');
    $carousel.on('slide.bs.carousel', (e) => {
      this.targetImg = e.relatedTarget;
    });
    this.initImg = document.getElementById('first-image');
  }

  predict() {
    const img = (this.targetImage ? $(this.targetImg).children(0).children(0)[0] : this.initImg),
      imgRatio = img.width / img.height,
      xmlHttp = new XMLHttpRequest(),
      formData = new FormData();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const result = JSON.parse(xmlHttp.responseText);
        console.log(result);
      }
    };


    this.canvas.width = Math.max(96, 64 * imgRatio);
    this.canvas.height = Math.max(64, 96 / imgRatio);
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    formData.append('img', this.canvas.toDataURL());

    xmlHttp.open('POST', 'http://159.89.116.228/tool/ml/identify/', true);
    xmlHttp.setRequestHeader('X-CSRFToken', this.csrftoken);
    xmlHttp.send(formData);
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
        <div className="content-main">
          <div className="img-container center-display">
            <div id="carouselWithIndicator" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-target="#carouselWithIndicator" data-slide-to="0" className="active" />
                <li data-target="#carouselWithIndicator" data-slide-to="1" />
                <li data-target="#carouselWithIndicator" data-slide-to="2" />
                <li data-target="#carouselWithIndicator" data-slide-to="3" />
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="center-display">
                    <img className="d-block w-100" src={`${IMAGE_URL}fish1.jpg`} alt="First slide" id="first-image" />
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="center-display">
                    <img className="d-block w-100" src={`${IMAGE_URL}fish2.jpg`} alt="Second slide" />
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="center-display">
                    <img className="d-block w-100" src={`${IMAGE_URL}fish3.jpg`} alt="Third slide" />
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="center-display">
                    <img className="d-block w-100" src={`${IMAGE_URL}fish4.jpg`} alt="Fourth slide" />
                  </div>
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselWithIndicator" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselWithIndicator" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div className="center-display">
            <button className="sp-btn btn-2 center-display" id="predict" onClick={this.predict}>Predict</button>
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
