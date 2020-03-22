import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { name as ConvoName, actions as ConvoActions } from 'redux/api/conversations/conversations';
import { name as MeName } from 'redux/api/me/me';

import CONFIG from 'config';

export const addConvo = (options, participantEmail, dispatch) => {
  ConvoActions.add(options, participantEmail)(dispatch);
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
  const [newConvoName, setNewConvoName] = useState(`Convo with ${myName}`);

  useEffect(() => {
  }, [conversations]);

  // const lastconvoNumber = useSelector(state => state[ConvoName].conversations.sort(sortByconvoNumber).slice(-1)[0]).convoNumber;

  const setConvoOptions = () => {
    let lastconvoNumber = 0;
    if (conversations && conversations.length > 0) {
      lastconvoNumber = conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 1;
    }

    return CONFIG.CONVERSATION_DEFAULTS(lastconvoNumber, roomName, newConvoName);
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
    setNewConvoName('');
    setCreateConvo(false);
    if (onCreate) onCreate(convo);
  };

  // TODO add validation of input, and if name already exists

  return (
    <div>
      {!createConvo &&
        <button onClick={() => setCreateConvo(true)}>Create New Convo</button>
      }
      {createConvo &&
        <>
          Name of Convo: <input value={newConvoName} onChange={e => setNewConvoName(e.target.value)} style={{fontSize: '12px', marginRight: '10px', width: '200px' }}/>
          <br/>
          <button onClick={createNewConversationClick}>Create new Conversation</button>
        </>
      }
    </div>
  )
}

export default CreateConversation;