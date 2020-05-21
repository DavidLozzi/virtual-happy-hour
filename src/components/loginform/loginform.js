import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import analytics, { CATEGORIES } from 'analytics/analytics';
import Button from 'components/button/button';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';

import { actions as MeActions } from 'redux/api/me/me';

// TODO make both fields required

const LoginForm = ({ roomName, onOpen }) => {
  const dispatch = useDispatch();
  const [myName, setMyName] = useState('');
  const [myEmail, setMyEmail] = useState('');

  const openRoom = () => {
    // #public is in index.html, very hacky approach but it works
    document.getElementById('public').after(document.getElementById('root'));
    document.getElementById('public').remove();
    MeActions.set(myName, myEmail)(dispatch);
    analytics.event('login', CATEGORIES.USER);
    localStorage.setItem('myName', myName);
    localStorage.setItem('myEmail', myEmail);
    if (onOpen) onOpen();
  };

  useEffect(() => {
    setMyName(localStorage.getItem('myName'));
    setMyEmail(localStorage.getItem('myEmail'));
    document.getElementById('room_intro').remove();
  }, []);

  return (
    <>
      <h2 className="major">The room <span>{roomName}</span> is ready, ready to join?</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Your Name"
          aria-label="Your Name"
          value={myName}
          onChange={e => setMyName(e.target.value)}
        />
        <FormControl
          placeholder="Your Email"
          aria-label="Your Name"
          value={myEmail}
          onChange={e => setMyEmail(e.target.value)}
          onEnter={openRoom}
        />
        <InputGroup.Append>
          <Button onClick={openRoom}>Let's Go!</Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  )
}

export default LoginForm;