import React, { useState, useContext, useEffect } from 'react';
import history from 'redux/history';
import { Button, InputGroup, Container, Row, Col } from 'react-bootstrap';

import { BrandContext } from 'brands/BrandContext';
import analytics, { CATEGORIES } from 'analytics/analytics';
import FormControl from 'components/formcontrol/formcontrol';
import PublicWrapper from 'components/publicwrapper/publicwrapper';

import './roomform.scss';

const RoomForm = () => {
  const [roomName, setRoomName] = useState('');
  const brand = useContext(BrandContext)
  const goToRoom = () => {
    const cleanRoomName = roomName.replace(/[^\w\s]/gi, '').trim().replace(/[\s]/gi, '-').toLowerCase();
    analytics.event('new room', CATEGORIES.ROOM, cleanRoomName);
    if (roomName) history.push(`/${cleanRoomName}`);
  };

  useEffect(() => {
    window.document.title = brand.title;
  }, [brand]);

  return (
    <PublicWrapper>
      <Container>
        <Row>
          <Col xs={12} className="mt-3">
            Start your free {brand.title} below! <a href="https://remoteparty.social" target="_blank" rel="noopener noreferrer" >Click here to learn more</a> about what you can do!
          </Col>
        </Row>
        <Row className="mt-5">
          <Col />
          <Col xs={12} ms={6}>
            Type in your room name below to get started.
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Room Name"
                aria-label="Room Name"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                onEnter={goToRoom}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={goToRoom}>Let's Do This</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col />
        </Row>
      </Container>

    </PublicWrapper>
  )
}

export default RoomForm;