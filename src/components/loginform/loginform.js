import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import App from 'App';

import Button from 'components/button/button';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import Jumbotron from 'components/jumbotron/jumbotron';

import { actions as MeActions } from 'redux/api/me/me';


const LoginForm = ({ roomName, onOpen }) => {
  const dispatch = useDispatch();
  const [myName, setMyName] = useState('David Lozzi'); // TODO get/set local storage
  const [myEmail, setMyEmail] = useState('david@lozzi.net');

  const openRoom = () => {
    document.getElementById('public').after(document.getElementById('root'));
    MeActions.set(myName, myEmail)(dispatch);
    if (onOpen) onOpen();
  };

  return (
    <Jumbotron>
      <h3>{roomName} is ready, want to join?</h3>
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
        />
      </InputGroup>
      <Button onClick={openRoom}>Let me in</Button>
    </Jumbotron>
  )
}

export default LoginForm;