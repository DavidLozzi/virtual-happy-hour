import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { name as RoomName } from 'redux/api/room/room';

import './counts.scss';

const Counts = () => {
  const room = useSelector(state => state[RoomName].room);

  return (
    <Row id="counts" noGutters>
      <Col xs={2} className="number">
        {room.conversations[0].participants.length}
      </Col>
      <Col xs={4} className="descriptor">
        people
      </Col>
      <Col xs={2} className="number">
        {room.conversations.length}
      </Col>
      <Col xs={4} className="descriptor">
        conversations
      </Col>
    </Row>
  )
};

export default Counts;