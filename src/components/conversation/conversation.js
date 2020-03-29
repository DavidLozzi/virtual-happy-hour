import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import Participants from '../participants/participants';

const Conversation = ({ convo, isEnlarged, setEnlargeConvo, options }) => {
  const dispatch = useDispatch();
  const myName = useSelector(state => state[MeName].name);
  const myEmail = useSelector(state => state[MeName].email);
  const [imInThisConvo, setImInThisConvo] = useState(false);
  const canEnlarge = !isEnlarged && convo.canResize && imInThisConvo;

  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: myName
  };

  // TODO refactor to util, also in room.js
  const amIInThisConvo = (convo) => convo && convo.participants.find(p => p === myEmail);

  const joinConvo = (convo) => {
    RoomActions.addParticipant(convo, myEmail)(dispatch);
    removeMeFromOtherConvos(convo);
    setTimeout(() => setEnlargeConvo(convo), 1000);
  };

  const removeMeFromOtherConvos = (convo) => {
    RoomActions.removeMeFromOtherConvos(convo, myEmail)(dispatch);
  }

  useEffect(() => {
    setImInThisConvo(amIInThisConvo(convo));
  }, [convo]);

  return ( // TODO refactor below to a new convo component, and make one for lobby wrapping convo
    <div key={convo.roomName} className={`convoWrapper ${isEnlarged ? 'enlargedWrapper' : ''}`}>
      {isEnlarged && <><button onClick={() => setEnlargeConvo(null)}>close</button><br /></>}
      <h4>{convo.roomTitle}</h4>
      {canEnlarge && <><button onClick={() => setEnlargeConvo(convo)}>enlarge</button><br /></>}
      {imInThisConvo && <Jitsi
        options={{ ...convo }}
        commands={defaultJitsiCommands}
        className={`${isEnlarged ? 'enlarged' : ''}`}
        mute={true}
      />}
      {!imInThisConvo && <button onClick={() => joinConvo(convo)}>join the conversation</button>}
      <Participants convo={convo} options={options} />
    </div>
  )
};

export default Conversation;