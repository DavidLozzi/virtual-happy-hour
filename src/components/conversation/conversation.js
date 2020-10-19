import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { ChevronBarRight, ChevronBarLeft } from 'react-bootstrap-icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { name as MeName } from 'redux/api/me/me';
import { actions as RoomActions } from 'redux/api/room/room';

import Jitsi from 'components/jitsi/jitsi';
import Participants from 'components/participants/participants';
import ConversationGroups from 'components/conversationgroups/conversationgroups';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './conversation.scss';

const Conversation = ({ room, convo }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state[MeName].participant);
  const [expandRight, setexpandRight] = useState(false);

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
        <Row id="conversation" noGutters className={expandRight ? 'expandRight' : ''}>
          <div className="mainCol">
            <Jitsi
              options={{ ...convo }}
              convoNumber={convo.convoNumber}
              user={me}
            />
          </div>
          <div className="rightCol max-height">
            <div className="space-up-down">
              <Row noGutters>
                <Col sm={12}><ConversationGroups room={room} onJoin={joinConvo} /></Col>
              </Row>
              <Row noGutters>
                <Col sm={12}>
                  <Participants participants={room.participants} isRoom onJoin={joinConvo} />
                </Col>
              </Row>
            </div>
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
            <div className="collapser" onClick={() => setexpandRight(!expandRight)}>
              <div className="chevron">{expandRight ? <ChevronBarRight /> : <ChevronBarLeft /> }</div>
            </div>
          </div>
        </Row>
      }
    </>
  )
};

export default Conversation;