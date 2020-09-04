import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import FormControl from 'components/formcontrol/formcontrol';
import { Button, Modal, InputGroup } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

const SendMessage = ({
  showMessageModal,
  hideSendMessage,
  sendTo
}) => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [message, setMessage] = useState('');

  const sendTheMessage = () => {
    analytics.event('Send Message', CATEGORIES.PARTICIPANTS);
    RoomActions.sendMessage(room.roomName, sendTo, `${message} <small className="text-muted">from ${me.name}</small>`)(dispatch);
    hideSendMessage();
    setMessage('');
  };

  return (
    <Modal
    show={showMessageModal}
    onHide={hideSendMessage}
  >
    <Modal.Header closeButton>Send a message</Modal.Header>
    <Modal.Body>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Message"
          aria-label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onEnter={sendTheMessage}
        />
      </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={sendTheMessage}>
        Send Message
  </Button>
    </Modal.Footer>
  </Modal>
  )
};

export default SendMessage;