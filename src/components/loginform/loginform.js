import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, InputGroup, Form, Row, Col } from 'react-bootstrap';
import { v4 } from 'uuid';
import colors from 'utils/colors';

import analytics, { CATEGORIES } from 'analytics/analytics';
import FormControl from 'components/formcontrol/formcontrol';
import PublicWrapper from 'components/publicwrapper/publicwrapper';

import { actions as MeActions } from 'redux/api/me/me';

const LoginForm = ({ roomName, onOpen }) => {
  const dispatch = useDispatch();
  const [myName, setMyName] = useState('');
  const [myUserId] = useState(v4());
  const [validated, setValidated] = useState(false);

  const openRoom = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity()) {
      const myColor = colors[Math.floor(Math.random() * colors.length)];
      MeActions.set(myName, myUserId, myColor)(dispatch);
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
  }, []);

  return (
    <PublicWrapper>
      <Row className="mt-5">
        <Col />
        <Col xs={6}>
          <h2>The room <strong>{roomName.split(' - ')[1]}</strong> is ready</h2>
          <div>Provide your name and press Join to get in on the fun!</div>
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
        </Col>
        <Col />
      </Row>
    </PublicWrapper>
  )
}

export default LoginForm;