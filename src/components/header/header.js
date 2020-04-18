import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';

import { name as RoomName } from 'redux/api/room/room';

/*
  Add buttons to right side of the bar:
  Heart button, as a menu
    Donate - link to my paypal or patreon.com?
    Feedback or Feature Request - link to github
    Report a Bug - link to github
  Bell button, as a menu of alerts (host notifications, invites, pair with toast)
  Gear button, host controls?
*/
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