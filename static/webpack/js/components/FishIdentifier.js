import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  GooglePlusShareButton, GooglePlusIcon,
} from 'react-share';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/js/dist/carousel';
import { IMAGE_URL } from '../consts';
import { setPredict } from '../actions';

class FishIdentifierDumb extends React.Component {
  constructor(props) {
    super(props);
    this.test = 1;
    this.predict = this.predict.bind(this);
    this.ownPredict = this.ownPredict.bind(this);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.imageInput = document.createElement('input');
    this.imageInput.setAttribute('type', 'file');
    this.reader = new FileReader();
    this.uploadedImage = null;
    this.prevIsUpload = false;
    this.reader.onloadend = () => {
      if (this.uploadedImage == null) this.uploadedImage = new Image();
      this.uploadedImage.src = this.reader.result;
      this.uploadedImage.onload = () => {
        this.targetImg = this.uploadedImage;
        this.prevIsUpload = true;
        this.predict();
      };
    };
    this.imageInput.onchange = (e) => {
      this.reader.readAsDataURL(e.path[0].files[0]);
    };

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
    this.carousel = $('.carousel').carousel({
      interval: false,
    });
    this.carousel.on('slide.bs.carousel', (e) => {
      [this.targetImg] = $(e.relatedTarget).children(0).children(0);
    });
    this.targetImg = document.getElementById('first-image');
  }

  predict() {
    const { storePredict } = this.props,
      img = this.targetImg,
      imgRatio = img.width / img.height,
      xmlHttp = new XMLHttpRequest(),
      formData = new FormData();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const result = JSON.parse(xmlHttp.responseText);
        if (result && result.result) {
          storePredict(result.result);
          if (this.prevIsUpload) {
            this.carousel.carousel(4);
            this.prevIsUpload = false;
          }
        }
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

  ownPredict() {
    this.imageInput.click();
  }

  render() {
    const { predict } = this.props;
    let uploadedImageDiv = null;

    if (this.uploadedImage) {
      uploadedImageDiv = (
        <div className="carousel-item">
          <div className="center-display">
            <img className="d-block w-100" src={this.uploadedImage.src} alt="Upload" />
          </div>
        </div>
      );
    }

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
                { this.uploadedImage ? <li data-target="#carouselWithIndicator" data-slide-to="4" /> : null }
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
                { uploadedImageDiv }
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
          <div>
            <div className="center-display">
              <button className="sp-btn btn-2 center-display predict-button" onClick={this.predict}>Predict</button>
              <button className="sp-btn btn-2 center-display try-button" onClick={this.ownPredict}>
                Try With Your Own Image
              </button>
            </div>
            <div className="center-display predict-results">
              <div className="alert alert-light">
                {predict[1].genusname} {predict[1].speciesname}
                <span className="progress-num">
                  {predict[1].confidence === 0 ? '' : `${predict[1].confidence}%`}
                </span>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${predict[1].confidence}%` }}
                    aria-valuenow={predict[1].confidence}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
              <div className="alert alert-light">
                {predict[2].genusname} {predict[2].speciesname}
                <span className="progress-num">
                  {predict[2].confidence === 0 ? '' : `${predict[2].confidence}%`}
                </span>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${predict[2].confidence}%` }}
                    aria-valuenow={predict[2].confidence}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
              <div className="alert alert-light">
                {predict[3].genusname} {predict[3].speciesname}
                <span className="progress-num">
                  {predict[3].confidence === 0 ? '' : `${predict[3].confidence}%`}
                </span>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${predict[3].confidence}%` }}
                    aria-valuenow={predict[3].confidence}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contend-end center-display">
          Proudly Made by Leo Zhu
        </div>
      </div>
    );
  }
}

FishIdentifierDumb.propTypes = {
  predict: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  storePredict: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    predict: state.fishIdentifier.predict,
  }),
  mapDispatchToProps = dispatch => ({
    storePredict: predict => dispatch(setPredict(predict)),
  }),
  FishIdentifier = connect(mapStateToProps, mapDispatchToProps)(FishIdentifierDumb);


export default FishIdentifier;
