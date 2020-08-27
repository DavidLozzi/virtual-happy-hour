import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, InputGroup, Form, Col } from 'react-bootstrap';

import { actions as RoomActions } from 'redux/api/room/room';

import analytics, { CATEGORIES } from 'analytics/analytics';
import FormControl from 'components/formcontrol/formcontrol';
import { name as MeName } from 'redux/api/me/me';

import CONFIG from 'config';
import { BrandContext } from 'brands/BrandContext';


const sortByconvoNumber = (a, b) => {
  if (a.convoNumber > b.convoNumber) {
    return 1;
  } else {
    return -1;
  }
};

const CreateConversation = ({ room, onCreate }) => {
  const dispatch = useDispatch();
  const brand = useContext(BrandContext);
  const me = useSelector(state => state[MeName].participant);
  const [createConvo, setCreateConvo] = useState(false);
  const [newConvoName, setNewConvoName] = useState(`Convo with ${me.name}`);
  const [iAmHost, setIAmHost] = useState(false);
  const [validated, setValidated] = useState(false);
  const { conversations, roomName, enableConvo, hosts } = room;

  useEffect(() => {
    setIAmHost(hosts.some(h => h.userId === me.userId));
  }, [hosts, me]);

  const setConvoOptions = () => {
    let newConvoNumber = 0;
    if (conversations && conversations.length > 0) {
      newConvoNumber = conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 1;
    }

    return CONFIG.CONVERSATION_DEFAULTS(newConvoNumber, roomName, newConvoName, brand.title);
  };

  const openCreateConvo = () => {
    setCreateConvo(true);
    setValidated(false);
    analytics.event('open_create_convo', CATEGORIES.CONVO);
  }

  const createNewConversationClick = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity()) {
      const convo = setConvoOptions();
      RoomActions.addConvo(convo, me)(dispatch);
      analytics.event('created_convo', CATEGORIES.CONVO, newConvoName);
      createRoomDone();
      if (onCreate) onCreate(convo);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const createRoomDone = () => {
    setNewConvoName('');
    setCreateConvo(false);
    analytics.event('close_create_convo', CATEGORIES.CONVO);
  };

  // TODO field should be required, validate the convo name doens't already exist
  return (
    <>
      {(enableConvo || iAmHost) &&
        <Col md={12}>
          {!createConvo &&
            <Button onClick={openCreateConvo} variant="link">Create New Conversation</Button>
          }
          {createConvo &&
            <div id="createconversation">
              <Form noValidate validated={validated} onSubmit={createNewConversationClick}>
                <Form.Row>
                  <Form.Group controlId="validationConvoName">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">Name</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        type="text"
                        placeholder="Conversation Name"
                        aria-label="Conversation Name"
                        value={newConvoName}
                        onChange={e => setNewConvoName(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">C'mon, you need to name it!</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form.Row>
                <Button variant="outline-secondary" type="submit">Create</Button>
                <Button variant="outline-secondary" onClick={createRoomDone}>Cancel</Button>
              </Form>
            </div>
          }
        </Col>
      }
    </>
  )
}

export default CreateConversation;