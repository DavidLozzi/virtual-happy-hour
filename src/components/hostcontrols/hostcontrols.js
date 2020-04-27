import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import { ButtonGroup, Button, OverlayTrigger, Popover, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './hostcontrols.scss';

// TODO have a host for the Lobby to control
//    notify all to come to lobby
//    enable/disbale creating convos

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

  const assignToConvos = () => {
    analytics.event('Assign to Convos', CATEGORIES.HOST_CONTROLS);
    // TODO ask how many people per room, default to 4, then click and do it.
  };

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
        room.conversations
          .find(c => c.convoNumber === 0)
          .hosts
          .find(h => h.email === me.email) &&
        <Col md={12} id="hostcontrols">
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`Click to ${room.enableConvo ? 'not' : ''} allow participants to make their own conversations`)}
            >
              <Button variant="primary" onClick={updateEnableConvo}>{room.enableConvo ? 'Disable' : 'Enable'} Conversations</Button>
            </OverlayTrigger>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`Send a message to everyone in the room`)}
            >
              <Button variant="primary" onClick={showSendMessage}>Message Everyone</Button>
            </OverlayTrigger>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`COMING SOON: Click to assign everyone to random conversations`)}
            >
              <Button variant="primary" onClick={assignToConvos}>Assign to Conversations</Button>
            </OverlayTrigger>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`COMING SOON: Close all conversations, except for the lobby, with a timely countdown.`)}
            >
              <Button variant="primary" onClick={closeConversations}>Close Conversations</Button>
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
                />
              </InputGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={sendMessage}>
                Send Message
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      }
    </>
  )
};

export default HostControls;