import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName } from 'redux/api/room/room';
import logo from 'assets/images/logo_50.png';

import Messages from 'components/messages/messages';
import HeartMenu from 'components/heartmenu/heartmenu';
import ExitButton from 'components/exitbutton/exitbutton';

import { BrandContext } from 'brands/BrandContext';

import './header.scss';

const Header = () => {
  const brand = useContext(BrandContext);
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);

  return (
    <Navbar bg="dark" variant="dark" id="header">
      <Navbar.Brand>
        {brand.logo && <img src={logo} alt={brand.title} className="logo" />}
        {room.roomName}
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <Messages />
          <HeartMenu />
          <div id="me">
            {me.name}
          </div>
          <ExitButton roomName={room.roomName} />
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;