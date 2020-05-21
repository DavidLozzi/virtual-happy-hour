import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './participants.scss';
// TODO add option to make someone else a host
// TODO add option to invite someone to join you in your convo, when press use modal to select a convo you're in

const Participants = ({ participants, listTitle, isConvo = false, isRoom = false, onJoin }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const primaryConvoNumber = useSelector(state => state[MeName].primaryConvoNumber);
  const room = useSelector(state => state[RoomName].room);
  const [iAmHost, setIAmHost] = useState(false);

  const makeHost = (host) => {
    analytics.event('Make host', CATEGORIES.PARTICIPANTS);
    RoomActions.addHost(room.roomName, host)(dispatch);
    RoomActions.sendMessage(room.roomName, host, `You've been made a host by ${me.name}`)(dispatch);
  }

  const removeHost = (host) => {
    analytics.event('Remove host', CATEGORIES.PARTICIPANTS);
    RoomActions.removeHost(room.roomName, host)(dispatch);
  }

  // TODO how to have the recipient click OK and join that convo?
  const invite = (participant) => {
    analytics.event('Invite to Convo', CATEGORIES.PARTICIPANTS);
    const inviteToConvo = room.conversations.find(c => c.convoNumber === primaryConvoNumber);
    if (inviteToConvo) {
      const message = `You've been invited to ${inviteToConvo.roomTitle} by ${me.name}`;
      const action = () => console.log("Accept");
      RoomActions.sendMessage(room.roomName, participant, message, action)(dispatch);
    } else {
      analytics.error('Invite to Convo', CATEGORIES.PARTICIPANTS, 'user not in a convo to invite');
      console.log('user is not in a convo to invite');
    }
  }

  const showParticpantMenu = () => {
    analytics.event('Show Menu', CATEGORIES.PARTICIPANTS);
  }

  useEffect(() => {
    if (room.hosts.some(h => h.email === me.email)) {
      setIAmHost(true);
    } else {
      setIAmHost(false);
    }

  }, [room, me]);

  return (
    <div id="participants">
      <p class="h5">Who's in {listTitle}</p>
      <div className="text-right"><small className="text-muted">{participants.length} {participants.length === 1 ? 'person' : 'people'}</small></div>
      {
        participants
          .map((parti) => {
            const isHost = room.hosts.some(h => h.email === parti.email);
            const inConvo = room.conversations.find(c => c.participants.some(p => p.email === parti.email));
            const showInvite = isRoom && (inConvo && (inConvo.convoNumber !== primaryConvoNumber));
            const isMe = parti.email === me.email;
            return (
              <Dropdown key={parti.email}>
                <Dropdown.Toggle variant="light" size="sm">
                  <div className={`participant ${isHost ? 'host' : ''}`} onClick={showParticpantMenu} role="button">
                    {isHost && <Badge variant="primary">Host</Badge>}
                    {isMe && <Badge variant="info">Me</Badge>}
                    {parti.name}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="dropdown-item">Talking in {inConvo && inConvo.roomTitle}
                    {showInvite &&
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="people">Click to join this conversation</Tooltip>}
                      >
                        <Badge variant="success" onClick={() => { onJoin(inConvo) }} size={25}>join</Badge>
                      </OverlayTrigger>
                    }
                  </div>
                  {!isMe &&
                    <>
                      {iAmHost && !isHost && <Dropdown.Item onClick={() => makeHost(parti)}>Make a Host</Dropdown.Item>}
                      {iAmHost && isHost && <Dropdown.Item onClick={() => removeHost(parti)}>Remove as Host</Dropdown.Item>}
                      {showInvite && <Dropdown.Item onClick={() => invite(parti)}>Invite to Conversation</Dropdown.Item>}
                    </>
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
          }
          )
      }
    </div>
  )
};

export default Participants;