import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';
import { ReactComponent as Exit } from 'assets/images/exit.svg';

import './exitbutton.scss';

const Header = ({ roomName }) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);


  const showLeaveDialog = () => {
    analytics.event('Open Leave', CATEGORIES.ROOM);
    setShowLeaveModal(true);
  };

  const hideLeaveDialog = () => {
    analytics.event('Close Leave', CATEGORIES.ROOM);
    setShowLeaveModal(false);
  };

  const leaveRoom = () => {
    analytics.event('Exit', CATEGORIES.ROOM, roomName);
    window.location.reload();
  };

  return ( <div id="exitbutton">
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>Take a hike, leave the room.</Tooltip>}
    >
      <div className="exit" onClick={showLeaveDialog}>
        <Exit className="icon" />
      </div>
    </OverlayTrigger>
    <Modal
      show={showLeaveModal}
      onHide={hideLeaveDialog}
      centered
      size="lg"
      id="leaving"
    >
      <Modal.Body>
        Are you sure that you want to leave the room? Don't worry, you can always rejoin.
        <br/><br/>Do you have feedback about your experience? Please let us know, <a href="https://remoteparty.social/contact/">click here to provide feedback or suggestions</a>.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={leaveRoom}>
          Yes, I'm leaving
        </Button>
        <Button variant="primary" onClick={hideLeaveDialog}>
          No, I'm staying
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default Header;