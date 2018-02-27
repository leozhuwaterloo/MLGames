import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  GooglePlusShareButton, GooglePlusIcon,
} from 'react-share';
import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/modal';
import { IMAGE_URL, TOOL_IDENTIFY_URL, TOOL_FISH_LIST_URL } from '../consts';
import { setPredict, setFishList } from '../actions';
import { fetchJson, getCSRFToken } from '../utils';

class FishIdentifierDumb extends React.Component {
  constructor(props) {
    super(props);
    this.test = 1;
    this.predict = this.predict.bind(this);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.imageInput = document.createElement('input');
    this.imageInput.setAttribute('type', 'file');
    this.reader = new FileReader();
    this.uploadedImage = null;
    this.prevIsUpload = false;
    this.imageInput.onchange = (e) => {
      this.reader.readAsDataURL(e.path[0].files[0]);
    };
    this.reader.onloadend = () => {
      if (this.uploadedImage == null) this.uploadedImage = new Image();
      this.uploadedImage.src = this.reader.result;
      this.uploadedImage.onload = () => {
        this.targetImg = this.uploadedImage;
        this.prevIsUpload = true;
        this.predict();
      };
    };
    this.csrftoken = getCSRFToken();
    fetchJson(TOOL_FISH_LIST_URL, this.csrftoken, (res) => {
      props.storeFishList(res);
    });
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
      imgRatio = img.width / img.height;

    this.canvas.width = Math.max(96, 64 * imgRatio);
    this.canvas.height = Math.max(64, 96 / imgRatio);
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    fetchJson(TOOL_IDENTIFY_URL, this.csrftoken, (res) => {
      storePredict(res.result);
      if (this.prevIsUpload) {
        this.carousel.carousel(4);
        this.prevIsUpload = false;
      }
    }, { img: this.canvas.toDataURL() });
  }

  render() {
    const { predict, fishList } = this.props,
      fishListDiv = [],
      fishPredictDiv = [];
    let uploadedImageDiv = null,
      i = 0;

    if (this.uploadedImage) {
      uploadedImageDiv = (
        <div className="carousel-item">
          <div className="center-display">
            <img className="d-block w-100" src={this.uploadedImage.src} alt="Upload" />
          </div>
        </div>
      );
    }

    if (fishList) {
      Object.keys(fishList).forEach((fishId) => {
        if (fishList[fishId].genusname) {
          i += 1;
          fishListDiv.push( // eslint-disable-line function-paren-newline
            <a
              key={fishId}
              target="_blank"
              href={`https://www.google.ca/search?q=${fishList[fishId].genusname}+${fishList[fishId].speciesname}`}
            >
              {i}: {fishList[fishId].genusname} {fishList[fishId].speciesname}
            </a>);
        }
      });
    }

    for (i = 1; i < 4; i += 1) {
      fishPredictDiv.push( // eslint-disable-line function-paren-newline
        <div className="alert alert-light" key={i}>
          <a
            target="_blank"
            href={`https://www.google.ca/search?q=${predict[i].genusname}+${predict[i].speciesname}`}
          >
            {predict[i].genusname} {predict[i].speciesname}
          </a>
          <span className="progress-num">
            {predict[i].confidence === 0 ? '' : `${predict[i].confidence}%`}
          </span>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{ width: `${predict[i].confidence}%` }}
              aria-valuenow={predict[i].confidence}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>);
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
              <button className="sp-btn btn-2 center-display try-button" onClick={() => this.imageInput.click()}>
                Try With Your Own Image
              </button>
            </div>
            <div className="center-display predict-results">
              {fishPredictDiv}
            </div>
          </div>
        </div>
        <div className="contend-end center-display">
          Proudly Made by Leo Zhu
          <button
            className="sp-btn btn-4 center-display fish-list-button"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
          >
            FishList
          </button>
          <div
            className="modal fade bd-example-modal-lg"
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Fish List</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    I am sorry but I can only recognize the following fishes:
                  </p>
                  {fishListDiv}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FishIdentifierDumb.propTypes = {
  predict: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fishList: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  storePredict: PropTypes.func.isRequired,
  storeFishList: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    predict: state.fishIdentifier.predict,
    fishList: state.fishIdentifier.fishList,
  }),
  mapDispatchToProps = dispatch => ({
    storePredict: predict => dispatch(setPredict(predict)),
    storeFishList: fishList => dispatch(setFishList(fishList)),
  }),
  FishIdentifier = connect(mapStateToProps, mapDispatchToProps)(FishIdentifierDumb);


export default FishIdentifier;
