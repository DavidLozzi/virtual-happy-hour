import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Button } from 'react-bootstrap';

import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';

import analytics, { CATEGORIES } from 'analytics/analytics';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import Participants from 'components/participants/participants';

import './conversation.scss';

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

const Conversation = ({ convo, onJoin, onLeave, onMaximize, onMinimize, options, layout, viewOptions, topRight, bottomRight }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [imInThisConvo, setImInThisConvo] = useState(false);
  const [myName, setMyName] = useState(me.name);
  const [myEmail, setMyEmail] = useState(me.email);
  const [isMaximized, setIsMaximized] = useState(false);

  const defaultViewOptions = {
    showTitle: true
  };
  const view = viewOptions ? Object.assign(defaultViewOptions, viewOptions) : defaultViewOptions;

  const isLobby = convo.convoNumber === 0;
  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: myName
  };

  useEffect(() => {
    setMyName(me.name);
    setMyEmail(me.email);
  }, [me]);

  const trackEvent = (action) => {
    analytics.event(action, CATEGORIES.CONVO, convo.convoName);
  };

  const removeMeFromOtherConvos = () => {
    RoomActions.removeMeFromOtherConvos(convo, me)(dispatch);
  }

  const joinConvo = () => {
    RoomActions.addParticipant(convo, me)(dispatch);
    removeMeFromOtherConvos();
    trackEvent('join');
    setIsMaximized(true);
    if (onJoin) onJoin(convo);
  };

  const leaveConvo = () => {
    trackEvent('leave');
    RoomActions.removeMeFromThisConvo(convo, me)(dispatch);
    if (onLeave) onLeave();
  }

  const minimizeConvo = () => {
    trackEvent('minimize');
    setIsMaximized(false);
    if (onMinimize) onMinimize(convo);
  }

  const maximizeConvo = () => {
    trackEvent('maximize');
    setIsMaximized(true);
    if (onMaximize) onMaximize(convo);
  }

  useEffect(() => {
    const amIInThisConvo = convo.participants.some(p => p.email === myEmail);
    setImInThisConvo(amIInThisConvo);
    console.log('am-i-in', amIInThisConvo, convo.convoName);
  }, [convo]);

  return (
    <Row className={`${isMaximized ? 'maximizedWrapper' : ''}`}>
      <Col md={layout.video}>
        {view.showTitle && <h4>{convo.roomTitle}</h4>}
        <div className="convo-buttons">
          {imInThisConvo &&
            <>
              {isMaximized && <Button onClick={minimizeConvo}>minimize</Button>}
              {convo.canResize && <Button onClick={maximizeConvo}>maximize</Button>}
              {!isLobby && <Button onClick={leaveConvo}>leave</Button>}
            </>
          }
          {!imInThisConvo &&
            <Button onClick={joinConvo}>join the conversation</Button>
          }
        </div>
        {imInThisConvo &&
          <Jitsi
            options={{ ...convo }}
            commands={defaultJitsiCommands}
            className={`${isMaximized ? 'maximized' : ''}`}
            mute={true}
          />
        }
        {!imInThisConvo && // TODO could we use puppeteer on server to snap a picture of this room?
          <div>put image here</div>
        }
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