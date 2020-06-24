import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName } from 'redux/api/room/room';
import logo from 'assets/images/logo_50.png';

import Messages from 'components/messages/messages';
import HeartMenu from 'components/heartmenu/heartmenu';
import ExitButton from 'components/exitbutton/exitbutton';

import './header.scss';

const Header = () => {
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);

  return (
    <Navbar bg="dark" variant="dark" id="header">
      <Navbar.Brand>
        <img src={logo} alt="Virtual Happy Hour" className="logo"/> Virtual Happy Hour - {room.roomName}
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <Messages />
          <HeartMenu />
          <div id="me">
            {me.name}
          </div>
          <ExitButton />
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;