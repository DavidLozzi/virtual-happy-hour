import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import { ChevronBarRight, ChevronBarLeft } from 'react-bootstrap-icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { name as MeName } from 'redux/api/me/me';
import { actions as RoomActions } from 'redux/api/room/room';

import Jitsi from 'components/jitsi/jitsi';
import Participants from 'components/participants/participants';
import HostControls from 'components/hostcontrols/hostcontrols';
import ConversationGroups from 'components/conversationgroups/conversationgroups';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversation.scss';

// TODO enable jitsi on mobile https://community.jitsi.org/t/enable-mobile-browser-in-jitsi-meet/29076/11?u=davidlozzi
// TODO can we edit the convo name?

const Conversation = ({ room, convo }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [collapseRight, setCollapseRight] = useState(false);

  const trackEvent = (action, convo) => {
    analytics.event(action, CATEGORIES.CONVO, convo.roomTitle);
  };

  const joinConvo = (convo) => {
    if (convo) {
      RoomActions.addParticipant(convo, me)(dispatch);
      trackEvent('join', convo);
    }
  };

  return (
    <>
      {!convo && <div>loading</div>}
      {convo &&
        <Row id="conversation" noGutters>
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
                <Row noGutters>
                  <Col sm={12}><ConversationGroups room={room} onJoin={joinConvo} /></Col>
                </Row>
                <Row noGutters>
                  <Col sm={12}>
                    <Participants participants={room.participants} listTitle="Current Attendees" isRoom onJoin={joinConvo} />
                  </Col>
                </Row>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Container>
            </Col>
          }
        </Row>
      }
    </>
  )
};

export default Conversation;