import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Dropdown } from 'react-bootstrap';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './participants.scss';
// TODO add option to make someone else a host
// TODO add option to invite someone to join you in your convo, when press use modal to select a convo you're in

const Participants = ({ convo, options }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const room = useSelector(state => state[RoomName].room);
  const [inviteToConvo, setInviteToConvo] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  const makeHost = (host) => {
    console.log(host);
    // TODO API work first
  }

  // TODO how to have the recipient click OK and join that convo?
  const invite = (participant) => {
    const message = `You've been invited to ${inviteToConvo.roomTitle} by ${me.name}`;
    const action = () => console.log("Accept");
    RoomActions.sendMessage(room.roomName, participant, message, action)(dispatch);
  }

  useEffect(() => {
    const myConvo = room.conversations
      .filter(c => c.convoNumber !== 0)
      .find(c => c.participants.some(p => p.email === me.email));
    
    if(myConvo) {
      setShowInvite(true);
      setInviteToConvo(myConvo);
    }
  }, [room]);

  return (
    <div id="participants">
      <h5>Who's Here</h5>
      {
        convo.participants
          .map((parti) => {
            const isHost = (options && options.showHost && convo.hosts.find(h => h.email === parti.email));
            const isMe = parti.email === me.email;
            const iAmHost = isHost && isMe;
            return (
              <Dropdown key={parti.email}>
                <Dropdown.Toggle variant="light" size="sm">
                  <div className={`participant ${isHost ? 'host' : ''}`}>
                    {isHost && <Badge variant="primary">Host</Badge>}
                    {isMe && <Badge variant="info">Me</Badge>}
                    {parti.name}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div>email: {parti.email}</div>
                  {!isMe &&
                    <>
                      {iAmHost && <Dropdown.Item onClick={() => makeHost(parti)}>Make Host</Dropdown.Item>}
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