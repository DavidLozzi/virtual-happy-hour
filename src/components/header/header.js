import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';

import { name as RoomName } from 'redux/api/room/room';

const Header = () => {
  const room = useSelector(state => state[RoomName].room);

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        Virtual Happy Hour - {room.roomName}
      </Navbar.Brand>
    </Navbar>
  )
}

export default Header;