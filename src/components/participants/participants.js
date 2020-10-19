import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { name as MeName, actions as MeActions } from 'redux/api/me/me';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import SendMessage from 'components/sendmessage/sendmessage';
import analytics, { CATEGORIES } from 'analytics/analytics';
import ParticipantIcon from 'components/participanticon/participanticon';

import './participants.scss';
// TODO add option to make someone else a host
// TODO add option to invite someone to join you in your convo, when press use modal to select a convo you're in

const Participants = ({ participants, isRoom = false, onJoin }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const room = useSelector(state => state[RoomName].room);
  const [iAmHost, setIAmHost] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [sendMessageTo, setSendMessageTo] = useState('');
  const isAdmin = window.location.href.indexOf('localhost') > -1 || window.location.href.indexOf('test=true') > -1;

  const makeHost = (host) => {
    analytics.event('Make host', CATEGORIES.PARTICIPANTS);
    RoomActions.addHost(room.roomName, host, () => {
      RoomActions.sendMessage(room.roomName, host, `You've been made a host by ${me.name}`)(dispatch);
    })(dispatch);
    
  }

  const removeHost = (host) => {
    analytics.event('Remove host', CATEGORIES.PARTICIPANTS);
    RoomActions.removeHost(room.roomName, host)(dispatch);
  }

  const showMessageModal = (host) => {
    setSendMessageTo(host);
    setShowSendMessage(true);
  }

  // TODO how to have the recipient click OK and join that convo?
  const invite = (participant) => {
    analytics.event('Invite to Convo', CATEGORIES.PARTICIPANTS);
    const inviteToConvo = room.conversations.find(c => c.convoNumber === me.primaryConvoNumber);
    if (inviteToConvo) {
      const message = `You've been invited to ${inviteToConvo.roomTitle} by ${me.name}`;
      const action = () => console.log("Accept"); // TODO support actions
      RoomActions.sendMessage(room.roomName, participant, message, action)(dispatch);
    } else {
      analytics.error('Invite to Convo', CATEGORIES.PARTICIPANTS, 'user not in a convo to invite');
      console.error('user is not in a convo to invite');
    }
  }

  const showParticpantMenu = () => {
    analytics.event('Show Menu', CATEGORIES.PARTICIPANTS);
  }

  const impersonate = (participant) => {
    if(isAdmin) {
      MeActions.set(participant.name, participant.userId, participant.color)(dispatch);
      analytics.event('impersonate', CATEGORIES.ADMIN);
    }
  }

  useEffect(() => {
    if (room.hosts.some(h => h.userId === me.userId)) {
      setIAmHost(true);
    } else {
      setIAmHost(false);
    }

  }, [room, me]);

  return (
    <div id="participants">
      <p className="h5">Current Attendees</p>
      <div className="text-right"><small className="text-muted">{participants.length} {participants.length === 1 ? 'person' : 'people'}</small></div>
      <div className="scroller">
        {
          participants
            .sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }
              return -1; 
            })
            .map((parti) => {
              const isHost = room.hosts.some(h => h.userId === parti.userId);
              const inConvo = room.conversations.find(c => c.convoNumber === parti.primaryConvoNumber);
              const showInvite = isRoom && (inConvo && (inConvo.convoNumber !== me.primaryConvoNumber));
              const isMe = parti.userId === me.userId;
              return (
                <Dropdown key={parti.userId} drop="bottom">
                  <Dropdown.Toggle variant="light" size="sm">
                    <div className={`participant ${isHost ? 'host' : ''}`} onClick={showParticpantMenu} role="button">
                      <ParticipantIcon participant={parti} className="icon" />
                      {parti.name}
                      {isHost && <Badge variant="primary">Host</Badge>}
                      {isMe && <Badge variant="info">Me</Badge>}
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
                        {isHost && <Dropdown.Item onClick={() => showMessageModal(parti)}>Send host a message</Dropdown.Item>}
                        {showInvite && <Dropdown.Item onClick={() => invite(parti)}>Invite to Conversation</Dropdown.Item>}
                        {isAdmin && <Dropdown.Item onClick={() => impersonate(parti)}>Impersonate</Dropdown.Item>}
                      </>
                    }
                  </Dropdown.Menu>
                </Dropdown>
              )
            }
            )
        }
      </div>
      <SendMessage
        sendTo={sendMessageTo}
        showMessageModal={showSendMessage}
        hideSendMessage={() => setShowSendMessage(false)}
      />
    </div>
  )
};

export default Participants;