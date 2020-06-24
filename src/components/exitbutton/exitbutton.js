import React from 'react';
import { ReactComponent as Exit } from 'assets/images/exit.svg';

import './exitbutton.scss';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Header = () => {
  const leaveRoom = () => {
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