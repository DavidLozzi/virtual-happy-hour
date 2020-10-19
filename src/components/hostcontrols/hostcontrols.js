import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Gear } from 'react-bootstrap-icons';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName} from 'redux/api/me/me';
import FormControl from 'components/formcontrol/formcontrol';
import { Button, OverlayTrigger, Tooltip, Popover, Modal, Dropdown, InputGroup } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';
import AssignConvos from 'components/assignconvos/assignconvos';
import { v4 } from 'uuid';
import colors from 'utils/colors';

import './hostcontrols.scss';

const HostControls = () => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const isAdmin = window.location.href.indexOf('localhost') > -1 || window.location.href.indexOf('test=true') > -1;

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
    RoomActions.sendMessageToAll(room.roomName, room.participants, `${message} from ${me.name}`)(dispatch);
    setShowMessageModal(false);
    setMessage('');
  };

  const settingsButton = React.forwardRef(({ children, onClick }, ref) => (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>Settings and options</Tooltip>}
    >
      <Gear
        className="icon"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      />
    </OverlayTrigger>
  ))

  const createTestAccounts = () => {
    let convoCnt = 0;
    for(let i = 0; i <= 15; i++){
      const myColor = colors[Math.floor(Math.random() * colors.length)];
      const names = ['Jeremiah', 'Annabelle', 'Calvin', 'Penelope', 'Heather', 'Dan', 'George', 'Lewis', 'Stacey', 'Karl', 'Connor', 'Luke', 'Erik', 'Curtis', 'Tim'];
      // MeActions.set(names[i], v4(), myColor)(dispatch);
      RoomActions.addParticipant(room.conversations[convoCnt],{ name: names[i], userId: v4(), color: myColor })(dispatch);
      convoCnt + 1 < room.conversations.length ? convoCnt++ : convoCnt = 0;

      console.log('Added ', names[i], ' to convo ', room.conversations[convoCnt].roomTitle);
    }
    analytics.event('createTestAccounts', CATEGORIES.ADMIN);
  }

  return (
    <>
      {
        room.hosts
          .find(h => h.userId === me.userId) &&
          <Dropdown drop="left" id="hostcontrols">
            <Dropdown.Toggle as={settingsButton} />
            <Dropdown.Menu>
              <OverlayTrigger
                trigger="hover"
                placement="left"
                overlay={makePopover(`Click to ${room.enableConvo ? 'not' : ''} allow participants to make their own conversations`)}
              >
                <Dropdown.Item variant="primary" onClick={updateEnableConvo}>{room.enableConvo ? 'Disable' : 'Enable'} Conversations</Dropdown.Item>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="hover"
                placement="left"
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
                placement="left"
                overlay={makePopover(`COMING SOON: Close all conversations, except for the lobby, with a timely countdown.`)}
              >
                <Dropdown.Item variant="primary" onClick={closeConversations}>Close Conversations</Dropdown.Item>
              </OverlayTrigger>

              { isAdmin && 
                <Dropdown.Item onClick={createTestAccounts}>Add test accounts</Dropdown.Item>
              }
            </Dropdown.Menu>
          </Dropdown>
      }
    </>
  )
};

export default HostControls;