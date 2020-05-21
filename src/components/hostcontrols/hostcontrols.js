import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import { Button, OverlayTrigger, Popover, Col, Modal, Dropdown } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';
import AssignConvos from 'components/assignconvos/assignconvos';

import './hostcontrols.scss';

// TODO have a host for the Lobby to control
//    notify all to come to lobby

const HostControls = () => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const updateProp = (property, value) => {
    RoomActions.updateProperty(room.roomName, property, value)(dispatch);
  };

  const makePopover = (message) => (
    <Popover id="popover">
      <Popover.Content>
        {message}
      </Popover.Content>
    </Popover>
  );

  const updateEnableConvo = () => {
    analytics.event(room.enableConvo ? 'Disable Convos' : 'Enable Convos', CATEGORIES.HOST_CONTROLS);
    updateProp('enableConvo', !room.enableConvo);
  }

  const closeConversations = () => {
    analytics.event('Close Convos', CATEGORIES.HOST_CONTROLS);
    // TODO ask how many people per room, default to 4, then click and do it.
  };

  const showSendMessage = () => {
    analytics.event('Open Message', CATEGORIES.HOST_CONTROLS);
    setShowMessageModal(true);
  };

  const hideSendMessage = () => {
    analytics.event('Close Message', CATEGORIES.HOST_CONTROLS);
    setShowMessageModal(false);
  };

  const sendMessage = () => {
    analytics.event('Send Message', CATEGORIES.HOST_CONTROLS);
    RoomActions.sendMessageToAll(room.roomName, room.conversations[0].participants, `${message} from ${me.name}`)(dispatch);
    setShowMessageModal(false);
    setMessage('');
  };

  return (
    <>
      {
        room.hosts
          .find(h => h.email === me.email) &&
        <Col md={12} id="hostcontrols">
          <Dropdown>
            <Dropdown.Toggle>
              Host Controls
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <OverlayTrigger
                trigger="hover"
                placement="bottom"
                overlay={makePopover(`Click to ${room.enableConvo ? 'not' : ''} allow participants to make their own conversations`)}
              >
                <Dropdown.Item variant="primary" onClick={updateEnableConvo}>{room.enableConvo ? 'Disable' : 'Enable'} Conversations</Dropdown.Item>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="hover"
                placement="bottom"
                overlay={makePopover(`Send a message to everyone in the room`)}
              >
                <Dropdown.Item variant="primary" onClick={showSendMessage}>Message Everyone</Dropdown.Item>
              </OverlayTrigger>
              <Modal
                show={showMessageModal}
                onHide={hideSendMessage}
              >
                <Modal.Header closeButton>Send a message to all participants</Modal.Header>
                <Modal.Body>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Message"
                      aria-label="Message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onEnter={sendMessage}
                    />
                  </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={sendMessage}>
                    Send Message
              </Button>
                </Modal.Footer>
              </Modal>

              <AssignConvos />

              <OverlayTrigger
                trigger="hover"
                placement="bottom"
                overlay={makePopover(`COMING SOON: Close all conversations, except for the lobby, with a timely countdown.`)}
              >
                <Dropdown.Item variant="primary" onClick={closeConversations}>Close Conversations</Dropdown.Item>
              </OverlayTrigger>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      }
    </>
  )
};

export default HostControls;