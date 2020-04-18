import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as MeName } from 'redux/api/me/me';
import './participants.scss';
import { Badge, DropdownButton, Dropdown } from 'react-bootstrap';

// TODO add option to make someone else a host
// TODO add option to invite someone to join you in your convo, when press use modal to select a convo you're in

const Participants = ({ convo, options }) => {
  const myEmail = useSelector(state => state[MeName].participant.email);

  const makeHost = (host) => {
    console.log(host);
    // TODO API work first
  }

  return (
    <div id="participants">
      <h5>Who's Here</h5>
      {
        convo.participants
          .map((parti) => {
            const isHost = (options && options.showHost && convo.hosts.find(h => h.email === parti.email));
            const isMe = parti.email === myEmail;
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
                      {iAmHost && <Dropdown.Item onClick={makeHost(parti)}>Make Host</Dropdown.Item>}
                      <Dropdown.Item>Invite to Conversation</Dropdown.Item>
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