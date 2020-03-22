import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { actions as MeActions } from 'redux/api/me/me';


const EntryForm = ({ lobbyName, onOpen }) => {
  const dispatch = useDispatch();
  const [myName, setMyName] = useState('David Lozzi'); // TODO get/set local storage
  const [myEmail, setMyEmail] = useState('david@lozzi.net');

  const openRoom = () => {
    MeActions.set(myName, myEmail)(dispatch);

    if (onOpen) onOpen();
  };

  return (
    <div id="entryForm">
      <h3>To join the {lobbyName} room, please provide:</h3>
      <div>Your Name: <input value={myName} onChange={e => setMyName(e.target.value)} /></div>
      <div>Your Email: <input value={myEmail} onChange={e => setMyEmail(e.target.value)} /></div>
      <button onClick={openRoom}>Let's do this</button>
    </div>
  )
}

export default EntryForm;