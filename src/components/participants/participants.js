import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as MeName } from 'redux/api/me/me';
import './participants.scss';

const Participants = ({ convo, options }) => {
  const myEmail = useSelector(state => state[MeName].participant.email);

  return (
    <div id="participants">
      <h5>Who's Here</h5>
      {
        convo.participants
          .map((parti) => {
            const isHost = (options && options.showHost && convo.hosts.find(h => h.email === parti.email));
            const isMe = parti.email === myEmail;
            return (
              <div key={parti.email} className={`participant ${isHost ? 'host' : ''}`}>
                {isHost ? 'hosted by ' : ''}
                {isMe ? 'Me (' : ''}
                {`${parti.name} ~ ${parti.email}`}
                {isMe ? ')' : ''}
              </div>
            )
          }
          )
      }
    </div>
  )
};

export default Participants;