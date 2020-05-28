import React, { useState, useEffect } from 'react';
import history from 'redux/history';

import analytics, { CATEGORIES } from 'analytics/analytics';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import Button from 'components/button/button';

const RoomForm = () => {
  const [roomName, setRoomName] = useState('');
  const goToRoom = () => {
    analytics.event('new room', 'room', roomName);
    if (roomName) history.push(`/${roomName}`);
  };

  useEffect(() => {
    analytics.pageView('roomform',CATEGORIES.SITE);
  },[]);

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