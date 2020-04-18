import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';

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

const CreateConversation = ({ roomName, onCreate, conversations }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [createConvo, setCreateConvo] = useState(false);
  const [newConvoName, setNewConvoName] = useState(`Convo with ${me.name}`);
  const canCreateConvos = useSelector(state => state[RoomName].room.enableConvo);
  const [iAmHost, setIAmHost] = useState(false);

  useEffect(() => {
    setIAmHost(conversations
      .find(c => c.convoNumber === 0)
      .hosts
      .some(h => h.email === me.email));
  }, [conversations, me]);

  const setConvoOptions = () => {
    let lastconvoNumber = 0;
    if (conversations && conversations.length > 0) {
      lastconvoNumber = conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 1;
    }

    return CONFIG.CONVERSATION_DEFAULTS(lastconvoNumber, roomName, newConvoName);
  };

  const createNewConversationClick = () => {
    const convo = setConvoOptions();
    RoomActions.add(convo, me, me)(dispatch);
    createRoomDone(convo);
    analytics.event('create_convo', CATEGORIES.CONVO, newConvoName);
  };

  const createRoomDone = (convo) => {
    setNewConvoName('');
    setCreateConvo(false);
    analytics.event('open_create_convo', CATEGORIES.CONVO);
    if (onCreate) onCreate(convo);
  };

  // TODO field should be required, validate the convo name doens't already exist
  return (
    <>
      {(canCreateConvos || iAmHost) &&
        <div className="col-md-12">
          {!createConvo &&
            <Button onClick={() => setCreateConvo(true)}>Create New Convo</Button>
          }
          {createConvo &&
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Conversation Name"
                aria-label="Conversation Name"
                value={newConvoName}
                onChange={e => setNewConvoName(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={createNewConversationClick}>Create</Button>
              </InputGroup.Append>
            </InputGroup>
          }
        </div>
      }
    </>
  )
}

export default CreateConversation;