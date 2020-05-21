import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import CreateConversation from 'components/createconversation/createconversation';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversationlist.scss';

const ConversationList = ({ room, onJoin }) => {
  const primaryConvoNumber = useSelector(state => state[MeName].primaryConvoNumber);

  const dropdownClicked = () => {
    analytics.event('open_convo_list', CATEGORIES.CONVO);
  };

  return <>
    <Dropdown id="conversationList">
      <Dropdown.Toggle variant="light" size="sm">
        <span onClick={dropdownClicked}>{room.conversations.length} Conversations</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {room.conversations.map(convo => (
          <Dropdown.Item key={convo.convoNumber}>
            {convo.roomTitle}
            {convo.convoNumber === primaryConvoNumber &&
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="mine">You're in this conversation now</Tooltip>}
              >
                <Badge variant="info">mine</Badge>
              </OverlayTrigger>}
            {convo.convoNumber !== primaryConvoNumber &&
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="people">Click to join this conversation</Tooltip>}
              >
                <Badge variant="success" onClick={() => { onJoin(convo) }} size={25}>join</Badge>
              </OverlayTrigger>}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="people">People in this room {convo.participants.map(p => <div key={p.email}>{p.name}</div>)}</Tooltip>}
            >
              <Badge variant="primary">{convo.participants.length}</Badge>
            </OverlayTrigger>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown >
    <CreateConversation room={room} onCreate={onJoin} />
  </>
};

export default ConversationList;