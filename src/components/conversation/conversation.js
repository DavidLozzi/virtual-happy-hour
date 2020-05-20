import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';

import { name as MeName, actions as MeActions } from 'redux/api/me/me';
import { actions as RoomActions } from 'redux/api/room/room';

import Jitsi from 'components/jitsi/jitsi';
import Participants from 'components/participants/participants';
import HostControls from 'components/hostcontrols/hostcontrols';
import CreateConversation from 'components/createconversation/createconversation';
import ConversationList from 'components/conversationlist/conversationlist';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversation.scss';

// TODO enable jitsi on mobile https://community.jitsi.org/t/enable-mobile-browser-in-jitsi-meet/29076/11?u=davidlozzi
// move master participant list to the room, but never lose lobby

const Conversation = ({ room, convo }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [imInThisConvo, setImInThisConvo] = useState(false);

  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: me.name
  };

  const trackEvent = (action, convo) => {
    analytics.event(action, CATEGORIES.CONVO, convo.convoName);
  };

  const joinConvo = (convo) => {
    if (convo) {
      RoomActions.addParticipant(convo, me)(dispatch);
      MeActions.setPrimaryConvoNumber(convo.convoNumber)(dispatch);
      trackEvent('join', convo);
    }
  };

  useEffect(() => {
    if (convo) {
      const amIInThisConvo = convo.participants.some(p => p.email === me.email);
      setImInThisConvo(amIInThisConvo);
    }
  }, [convo, me]);

  return (
    <>
      {!convo && <div>loading</div>}
      {convo &&
        <Row id="conversation">
          <Col md={9}>
            {imInThisConvo &&
              <Jitsi
                options={{ ...convo }}
                commands={defaultJitsiCommands}
                mute={true}
                convoNumber={convo.convoNumber}
              />
            }
          </Col>
          <Col md={3}>
            <Container fluid>
              <Row noGutters><HostControls /></Row>
              <Row noGutters><Participants participants={convo.participants} listTitle={convo.roomTitle} isConvo /></Row>
              <Row noGutters>
                <Col sm={6}><ConversationList room={room} onJoin={joinConvo} /></Col>
                <Col sm={6}><CreateConversation room={room} onCreate={joinConvo} /></Col>
              <Row noGutters><Participants participants={room.participants} listTitle={`Room: ${room.roomName}`} isRoom onJoin={joinConvo} /></Row>
              </Row>
            </Container>
          </Col>
        </Row>
      }
    </>
  )
};

export default Conversation;