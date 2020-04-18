import React, { useState, useEffect } from 'react';
import history from 'redux/history';

import google from 'analytics/google';
import Jumbotron from 'components/jumbotron/jumbotron';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import Button from 'components/button/button';

const RoomForm = () => {
  const [roomName, setRoomName] = useState('');
  const goToRoom = () => {
    if (roomName) history.push(`/${roomName}`);
  };

  useEffect(() => {
    google.pageView();
  },[]);

  return (
    <Jumbotron>
      <h3>To get started, specify your room name below:</h3>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Room Name"
          aria-label="Room Name"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={goToRoom}>Let's Do This</Button>
        </InputGroup.Append>
      </InputGroup>
    </Jumbotron>
  )
}

export default RoomForm;