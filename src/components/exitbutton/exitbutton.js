import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';
import { ReactComponent as Exit } from 'assets/images/exit.svg';

import './exitbutton.scss';

const Header = ({ roomName }) => {
  const leaveRoom = () => {
    analytics.event('Exit', CATEGORIES.ROOM, roomName);
    window.location.href = "/";
  };

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>Take a hike, leave the room.</Tooltip>}
    >
      <div className="exit" onClick={leaveRoom}>
        <Exit />
      </div>
    </OverlayTrigger>
  )
}

export default Header;