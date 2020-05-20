import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as RoomActions } from 'redux/api/room/room';

import analytics, { CATEGORIES } from 'analytics/analytics';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import { name as MeName } from 'redux/api/me/me';
import Button from 'components/button/button';

import CONFIG from 'config';


const sortByconvoNumber = (a, b) => {
  if (a.convoNumber > b.convoNumber) {
    return 1;
  } else {
    return -1;
  }
};

const CreateConversation = ({ room, onCreate }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [createConvo, setCreateConvo] = useState(false);
  const [newConvoName, setNewConvoName] = useState(`Convo with ${me.name}`);
  const [iAmHost, setIAmHost] = useState(false);
  const [newConvoCreated, setNewConvoCreated] = useState();
  const { conversations, roomName, enableConvo, hosts } = room;

  useEffect(() => {
    setIAmHost(hosts.some(h => h.email === me.email));
  }, [hosts, me]);

  const setConvoOptions = () => {
    let newConvoNumber = 0;
    if (conversations && conversations.length > 0) {
      newConvoNumber = conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 1;
    }

    return CONFIG.CONVERSATION_DEFAULTS(newConvoNumber, roomName, newConvoName, [me]);
  };

  const openCreateConvo = () => {
    setCreateConvo(true);
    analytics.event('open_create_convo', CATEGORIES.CONVO);
  }

  const createNewConversationClick = () => {
    const convo = setConvoOptions();
    RoomActions.addConvo(convo)(dispatch);
    analytics.event('created_convo', CATEGORIES.CONVO, newConvoName);
    createRoomDone();
    setNewConvoCreated(convo);
    if(onCreate) onCreate(convo);
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
        <div className="col-md-12">
          {!createConvo &&
            <Button onClick={openCreateConvo}>New Convo</Button>
          }
          {createConvo &&
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Conversation Name"
                aria-label="Conversation Name"
                value={newConvoName}
                onChange={e => setNewConvoName(e.target.value)}
                onEnter={createNewConversationClick}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={createNewConversationClick}>Create</Button>
                <Button variant="outline-secondary" onClick={createRoomDone}>Cancel</Button>
              </InputGroup.Append>
            </InputGroup>
          }
        </div>
      }
    </>
  )
}

export default CreateConversation;