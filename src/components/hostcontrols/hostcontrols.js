import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import { ButtonGroup, Button, OverlayTrigger, Popover, Col } from 'react-bootstrap';

// TODO have a host for the Lobby to control
//    notify all to come to lobby
//    enable/disbale creating convos

const HostControls = () => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const myEmail = useSelector(state => state[MeName].participant.email);

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

  const assignToConvos = () => {
    // TODO ask how many people per room, default to 4, then click and do it.
  };

  const sendMessage = () => {
    // TODO ask for the message and then send to everyone
    // HOW? update all participants in lobby adding a message prop to them, when they ack clear it
  };

  return (
    <>
      {
        room.conversations
          .find(c => c.convoNumber === 0)
          .hosts
          .find(h => h.email === myEmail) &&
        <Col md={12} id="hostcontrols">
          <ButtonGroup>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`Click to ${room.enableConvo ? 'not' : ''} allow participants to make their own conversations`)}
            >
              <Button variant="primary" onClick={() => updateProp('enableConvo', !room.enableConvo)}>{room.enableConvo ? 'Disable' : 'Enable'} Conversations</Button>
            </OverlayTrigger>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`Click to assign everyone to random conversations`)}
            >
              <Button variant="primary" onClick={assignToConvos}>Assign to Conversations</Button>
            </OverlayTrigger>
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={makePopover(`Click to call everyone to come back to the lobby`)}
            >
              <Button variant="primary" onClick={sendMessage}>Message Everyone</Button>
            </OverlayTrigger>
          </ButtonGroup>
        </Col>
      }
    </>
  )
};

export default HostControls;