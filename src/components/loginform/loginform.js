import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { v4 } from 'uuid';

import analytics, { CATEGORIES } from 'analytics/analytics';
import FormControl from 'components/formcontrol/formcontrol';

import { actions as MeActions } from 'redux/api/me/me';

const LoginForm = ({ roomName, onOpen }) => {
  const dispatch = useDispatch();
  const [myName, setMyName] = useState('');
  const [myUserId] = useState(v4());
  const [validated, setValidated] = useState(false);

  const openRoom = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity()) {
      // #public is in index.html, very hacky approach but it works
      document.getElementById('public').after(document.getElementById('root'));
      document.getElementById('public').remove();
      MeActions.set(myName, myUserId)(dispatch);
      analytics.event('login', CATEGORIES.USER);
      localStorage.setItem('myName', myName);
      localStorage.setItem('myUserId', myUserId);
      if (onOpen) onOpen();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

  useEffect(() => {
    setMyName(localStorage.getItem('myName'));
    document.getElementById('room_intro').remove();
    window.scrollTo({ top: 500, behavior: 'smooth' });
  }, []);

  return (
    <>
      <h2 className="major">The room <span>{roomName}</span> is ready, do you want to join?</h2>
      <div></div>
      <Form noValidate validated={validated} onSubmit={openRoom}>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Your Name"
            aria-label="Your Name"
            value={myName}
            onChange={e => setMyName(e.target.value)}
            required
          />
          <InputGroup.Append>
            <Button type="submit">Let's Go!</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </>
  )
}

export default LoginForm;