import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { name as ConvoName, actions as ConvoActions } from 'redux/api/conversations/conversations';
import { name as MeName } from 'redux/api/me/me';

import CONFIG from 'config';

export const addConvo = (options, participantEmail, dispatch) => {
  ConvoActions.add(options, participantEmail)(dispatch);
};

const sortByRoomNumber = (a, b) => {
  if (a.roomNumber > b.roomNumber) {
    return 1;
  } else {
    return -1;
  }
};

const CreateConversation = ({ roomName, onCreate }) => {
  const dispatch = useDispatch();
  const myName = useSelector(state => state[MeName].name);
  const myEmail = useSelector(state => state[MeName].email);
  const lastRoomNumber = useSelector(state => state[ConvoName].conversations.sort(sortByRoomNumber).slice(-1)[0]).roomNumber;
  const [createConvo, setCreateConvo] = useState(false);
  const [newConvoName, setNewConvoName] = useState(`Convo with ${myName}`);
  const convo = CONFIG.CONVERSATION_DEFAULTS(lastRoomNumber + 1, roomName, newConvoName);

  const createNewConversationClick = () => {
    addConvo(convo, myEmail, dispatch);
    createRoomDone();
  };

  const createNewConversationOtherClick = () => {
    addConvo(convo, 'luke@skywalker.com', dispatch);
    createRoomDone();
  };

  const createRoomDone = () => {
    setNewConvoName('');
    setCreateConvo(false);
    if (onCreate) onCreate(convo);
  };

  return (
    <div>
      {!createConvo &&
        <button onClick={() => setCreateConvo(true)}>Create New Convo</button>
      }
      {createConvo &&
        <>
          Name: <input value={newConvoName} onChange={e => setNewConvoName(e.target.value)} />
          <button onClick={createNewConversationClick}>Create new Conversation</button>
          <button onClick={createNewConversationOtherClick}>Another User Creates Conversation</button>
        </>
      }
    </div>
  )
}

export default CreateConversation;