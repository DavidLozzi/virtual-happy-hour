import React from 'react';

import {Container, Row, Col} from 'react-bootstrap';

import './browser.scss';

const Browser = () => {
  document.title = "Sorry, we don't support IE";

  return (
    <Container id="browser">
      <Row>
        <Col/>
        <Col xs={12} ms={8}>
          <h2>RemoteParty.Social</h2>
          <div className="gif_wrapper">
          <iframe src="https://giphy.com/embed/864533yaFNqs8" title="R2D2" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          </div>
          <h3>Uh oh...</h3>

          <div className="gif_wrapper">
            <iframe src="https://giphy.com/embed/4Vnbd8ZXTHM24MTncV" title="Cantina" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          </div>
          <h3>We don't support Internet Explorer</h3>

          <div className="gif_wrapper">
            <iframe src="https://giphy.com/embed/87I8pKmdcAKw8" title="Yoda Fail" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          </div>

          <h3>Install <a href="https://www.google.com/chrome/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></h3>
          <div className="gif_wrapper">
            <iframe src="https://giphy.com/embed/3o84sw9CmwYpAnRRni" title="do it" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
            </div>

          <h3>You'll thank me later</h3>
          <div className="gif_wrapper">
            <iframe src="https://giphy.com/embed/A4pNvfLGTX4m4" title="scoundrel" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          </div>
          <h3>See you back soon!</h3>

          <div className="gif_wrapper">
            <iframe src="https://giphy.com/embed/xTiTnDCzB5QjCb9GRq" title="home" width="100%" height="100%" style={{position:'absolute'}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          </div>
          </Col>
        <Col />
      </Row>
    </Container>
    
  )
};

export default Browser;