import React, { useState } from 'react';
import history from 'redux/history';

import analytics, { CATEGORIES } from 'analytics/analytics';
import FormControl from 'components/formcontrol/formcontrol';
import {Button, InputGroup} from 'react-bootstrap';

const RoomForm = () => {
  const [roomName, setRoomName] = useState('');
  const goToRoom = () => {
    const cleanRoomName = roomName.replace(/[^\w\s]/gi, '').trim().replace(/[\s]/gi, '-').toLowerCase();
    analytics.event('new room', CATEGORIES.ROOM, cleanRoomName);
    if (roomName) history.push(`/${cleanRoomName}`);
  };

  return (
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
  )
}

export default RoomForm;