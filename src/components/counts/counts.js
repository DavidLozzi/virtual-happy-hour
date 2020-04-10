import React from 'react';
import { Row, Col } from 'react-bootstrap';

import './counts.scss';

const Counts = () => {

  return (
    <Row id="counts" noGutters>
      <Col xs={2} className="number">
        22
      </Col>
      <Col xs={4} className="descriptor">
        people
      </Col>
      <Col xs={2} className="number">
        6
      </Col>
      <Col xs={4} className="descriptor">
        conversations
      </Col>
    </Row>
  )
};

export default Counts;