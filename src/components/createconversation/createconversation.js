import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import InputGroup from 'components/inputgroup/inputgroup';
import FormControl from 'components/formcontrol/formcontrol';
import { name as MeName } from 'redux/api/me/me';
import Button from 'components/button/button';

import CONFIG from 'config';

export const addConvo = (options, participantEmail, dispatch) => {
  RoomActions.add(options, participantEmail, participantEmail)(dispatch);
};

const sortByconvoNumber = (a, b) => {
  if (a.convoNumber > b.convoNumber) {
    return 1;
  } else {
    return -1;
  }
};

const CreateConversation = ({ roomName, onCreate, conversations }) => {
  const dispatch = useDispatch();
  const myName = useSelector(state => state[MeName].name);
  const myEmail = useSelector(state => state[MeName].email);
  const [createConvo, setCreateConvo] = useState(false);
  const [newRoomName, setNewRoomName] = useState(`Convo with ${myName}`);

  useEffect(() => {
  }, [conversations]);

  // const lastconvoNumber = useSelector(state => state[RoomName].conversations.sort(sortByconvoNumber).slice(-1)[0]).convoNumber;

  const setConvoOptions = () => {
    let lastconvoNumber = 0;
    if (conversations && conversations.length > 0) {
      lastconvoNumber = conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 1;
    }

    return CONFIG.CONVERSATION_DEFAULTS(lastconvoNumber, roomName, newRoomName);
  };

  const createNewConversationClick = () => {
    const convo = setConvoOptions();
    addConvo(convo, myEmail, dispatch);
    createRoomDone(convo);
  };

  const createNewConversationOtherClick = () => {
    const convo = setConvoOptions();
    addConvo(convo, 'luke@skywalker.com', dispatch);
    createRoomDone(convo);
  };

  const createRoomDone = (convo) => {
    setNewRoomName('');
    setCreateConvo(false);
    if (onCreate) onCreate(convo);
  };

  // TODO add validation of input, and if name already exists

  return (
    <div>
      {!createConvo &&
        <Button onClick={() => setCreateConvo(true)}>Create New Convo</Button>
      }
      {createConvo &&
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Conversation Name"
            aria-label="Conversation Name"
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={createNewConversationClick}>Create</Button>
          </InputGroup.Append>
        </InputGroup>
      }
    </div>
  )
}

export default CreateConversation;