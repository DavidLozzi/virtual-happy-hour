import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import CreateConversation from 'components/createconversation/createconversation';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversationlist.scss';

const ConversationList = ({ room, onJoin }) => {
  const primaryConvoNumber = useSelector(state => state[MeName].primaryConvoNumber);


  return <>
  <h5>All Conversations</h5>
    <div id="conversationList">
      {room.conversations.map(convo => (
        <div key={convo.convoNumber} onClick={() => { onJoin(convo) }} className="convoItem">
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
              <Badge variant="success" size={25}>join</Badge>
            </OverlayTrigger>}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="people">People in this room {convo.participants.map(p => <div key={p.email}>{p.name}</div>)}</Tooltip>}
          >
            <Badge variant="primary">{convo.participants.length}</Badge>
          </OverlayTrigger>
        </div>
      ))}
    </div>
    <CreateConversation room={room} onCreate={onJoin} />
  </>
};

export default ConversationList;