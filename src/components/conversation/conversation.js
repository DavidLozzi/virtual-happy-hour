import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import { ChevronBarRight, ChevronBarLeft } from 'react-bootstrap-icons';

import { name as MeName } from 'redux/api/me/me';
import { actions as RoomActions } from 'redux/api/room/room';

import Jitsi from 'components/jitsi/jitsi';
import Participants from 'components/participants/participants';
import HostControls from 'components/hostcontrols/hostcontrols';
import ConversationList from 'components/conversationlist/conversationlist';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversation.scss';

// TODO enable jitsi on mobile https://community.jitsi.org/t/enable-mobile-browser-in-jitsi-meet/29076/11?u=davidlozzi
// TODO can we edit the convo name?

const Conversation = ({ room, convo }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [participantsList, setParticipantList] = useState([]);
  const [collapseRight, setCollapseRight] = useState(false);

  useEffect(() => {
    if (convo) {
      setParticipantList(room.participants.filter(p => p.primaryConvoNumber === convo.convoNumber));
    }
  }, [room, convo]);

  const trackEvent = (action, convo) => {
    analytics.event(action, CATEGORIES.CONVO, convo.convoName);
  };

  const joinConvo = (convo) => {
    if (convo) {
      console.log("B");
      RoomActions.addParticipant(convo, me)(dispatch);
      trackEvent('join', convo);
    }
  };

  return (
    <>
      {!convo && <div>loading</div>}
      {convo &&
        <Row id="conversation">
          <Col md={collapseRight ? 12 : 9} >
            <div className="collapser" onClick={() => setCollapseRight(!collapseRight)}>
              {collapseRight ? <ChevronBarLeft /> : <ChevronBarRight />}
            </div>
            <Jitsi
              options={{ ...convo }}
              convoNumber={convo.convoNumber}
              user={me}
            />
          </Col>
          {!collapseRight &&
            <Col md={3}>
              <Container fluid>
                <Row noGutters><HostControls /></Row>
                <Row noGutters><Participants participants={participantsList} listTitle={convo.roomTitle} /></Row>
                <Row noGutters>
                  <Col sm={12}><ConversationList room={room} onJoin={joinConvo} /></Col>
                </Row>
                <Row noGutters><Participants participants={room.participants} listTitle="Current Attendees" isRoom onJoin={joinConvo} /></Row>
              </Container>
            </Col>
          }
        </Row>
      }
    </>
  )
};

export default Conversation;