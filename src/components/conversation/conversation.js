import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import Participants from '../participants/participants';

import './conversation.scss';
import { Row, Col, Container } from 'react-bootstrap';

export const LAYOUTS = {
  WIDE: {
    video: 9,
    participants: 3
  },
  NARROW: {
    video: 12,
    participants: 12
  }
};

// TODO enable jitsi on mobile https://community.jitsi.org/t/enable-mobile-browser-in-jitsi-meet/29076/11?u=davidlozzi
// TODO when I'm not in a convo, replace jitsi with a placeholder image

const Conversation = ({ convo, isEnlarged, setEnlargeConvo, options, layout, viewOptions, topRight, bottomRight }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [imInThisConvo, setImInThisConvo] = useState(false);
  const [myName, setMyName] = useState(me.name);
  const [myEmail, setMyEmail] = useState(me.email);

  const defaultViewOptions = {
    showTitle: true
  };
  const view = viewOptions ? Object.assign(defaultViewOptions, viewOptions) : defaultViewOptions;

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
    <Row className={`${isEnlarged ? 'enlargedWrapper' : ''}`}>
      <Col md={layout.video}>
        {view.showTitle && <h4>{convo.roomTitle}</h4>}
        <div className="convo-buttons">
          {imInThisConvo &&
            <>
              {isEnlarged && <button onClick={() => setEnlargeConvo(null)}>close</button>}
              {canEnlarge && <button onClick={() => setEnlargeConvo(convo)}>enlarge</button>}
              {!isLobby && <button onClick={() => leaveConvo(convo)}>leave</button>}
            </>
          }
          {!imInThisConvo &&
            <button onClick={() => joinConvo(convo)}>join the conversation</button>
          }
        </div>
        {imInThisConvo && <Jitsi
          options={{ ...convo }}
          commands={defaultJitsiCommands}
          className={`${isEnlarged ? 'enlarged' : ''}`}
          mute={true}
        />}
      </Col>
      <Col md={layout.participants}>
        {topRight && <Container fluid className="topRight">{topRight}</Container>}
        <Participants convo={convo} options={options} />
        {bottomRight && <Container fluid className="bottomRight">{bottomRight}</Container>}
      </Col>
    </Row>
  )
};

Conversation.defaultProps = {
  layout: LAYOUTS.NARROW,
  topRight: null,
  bottomRight: null
}

export default Conversation;