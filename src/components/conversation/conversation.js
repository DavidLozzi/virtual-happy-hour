import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import Participants from '../participants/participants';

import './conversation.scss';

export const LAYOUTS = {
  WIDE: {
    video: 'col-lg-9',
    participants: 'col-lg-3'
  },
  NARROW: {
    video: 'col-lg-12',
    participants: 'col-lg-12'
  },
}

// TODO enable jitsi on mobile https://community.jitsi.org/t/enable-mobile-browser-in-jitsi-meet/29076/11?u=davidlozzi

const Conversation = ({ convo, isEnlarged, setEnlargeConvo, options, layout }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [imInThisConvo, setImInThisConvo] = useState(false);
  const [myName, setMyName] = useState(me.name);
  const [myEmail, setMyEmail] = useState(me.email);
  
  const canEnlarge = !isEnlarged && convo.canResize;
  const isLobby = convo.convoNumber === 0;
  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: myName
  };

  useEffect(() => {
    setMyName(me.name);
    setMyEmail(me.email);
  }, [me]);

  // TODO refactor to util, also in room.js

  const joinConvo = (convo) => {
    RoomActions.addParticipant(convo, me)(dispatch);
    removeMeFromOtherConvos(convo);
    setTimeout(() => setEnlargeConvo(convo), 1000);
  };

  const removeMeFromOtherConvos = (convo) => {
    RoomActions.removeMeFromOtherConvos(convo, me)(dispatch);
  }

  const leaveConvo = (convo) => {
    RoomActions.removeMeFromThisConvo(convo, me)(dispatch);
  }

  useEffect(() => {
    const amIInThisConvo = (convo) => convo && convo.participants.find(p => p.email === myEmail);
    setImInThisConvo(amIInThisConvo(convo));
  }, [convo]);

  return (
    <div key={convo.convoName} className={`row convoWrapper ${isEnlarged ? 'enlargedWrapper' : ''}`}>
      <div className={layout.video}>
        <h4>{convo.roomTitle}</h4>
        <div className="convo-buttons">
          {imInThisConvo &&
            <>
              {isEnlarged && <button onClick={() => setEnlargeConvo(null)}>close</button>}
              {canEnlarge && <button onClick={() => setEnlargeConvo(convo)}>enlarge</button>}
              {!isLobby && <button onClick={() => leaveConvo(convo)}>leave</button>}
            </>
          }
        </div>
        {imInThisConvo && <Jitsi
          options={{ ...convo }}
          commands={defaultJitsiCommands}
          className={`${isEnlarged ? 'enlarged' : ''}`}
          mute={true}
        />}
      </div>
      <div className={layout.participants}>
        {!imInThisConvo && <button onClick={() => joinConvo(convo)}>join the conversation</button>}
        <Participants convo={convo} options={options} />
      </div>
    </div>
  )
};

Conversation.defaultProps = {
  layout: LAYOUTS.NARROW
}

export default Conversation;