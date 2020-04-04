import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as MeName } from 'redux/api/me/me';
import './participants.scss';

const Participants = ({ convo, options }) => {
  const myEmail = useSelector(state => state[MeName].email);

  return (
    <div id="participants">
      <h5>Who's Here</h5>
      {
        convo.participants
          .map((parti) => {
            const isHost = (options && options.showHost && convo.hosts.find(h => h === parti));
            const isMe = parti === myEmail;
            return (
              <div key={parti} className={`participant ${isHost ? 'host' : ''}`}>
                {isHost ? 'hosted by ' : ''}
                {isMe ? 'Me (' : ''}
                {parti}
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