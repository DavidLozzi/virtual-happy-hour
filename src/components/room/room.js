import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';

import LoginForm from 'components/loginform/loginform';
import CreateConversation from 'components/createconversation/createconversation';
import Conversation from 'components/conversation/conversation';
import LobbyConvo from 'components/lobbyconvo/lobbyconvo';
import Header from 'components/header/header';

import './room.scss';
import { Container, Row, Col, Jumbotron } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

// Backlog
// TODO add invite option to allow me to invite someone into my convo

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const lastRefreshed = useSelector(state => state[RoomName].lastRefreshed);
  const [maximizedConvo, setMaximizedConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);

  const roomName = match.params.roomName;
  const lobbyNumber = 0;

  const openRoom = () => {
    setLoadRoom(true);

  };

  const amIInThisConvo = (convo) => convo && convo.participants.find(p => p.email === me.email);

  const leaveConvo = () => {
    setMaximizedConvo(null);
  };

  useEffect(() => {
    if (roomName) {
      analytics.pageView(`room-${roomName}`, `room ${roomName}`);
      RoomActions.setRoom(roomName)(dispatch);
      RoomActions.listen()(dispatch);
    } else {
      analytics.pageView('room-none', 'no room');
    }
  }, [roomName, dispatch])

  useEffect(() => {
    const createLobby = () => {
      const lobbyConvo = Object.assign(
        CONFIG.CONVERSATION_DEFAULTS(0, roomName, `Lobby for ${roomName}`),
        { // override the typical convo settings for the main lobby
          height: 600,
          width: 800,
          canResize: false
        }
      );
      RoomActions.add(lobbyConvo, me, me)(dispatch);
      analytics.nonInteractionEvent('lobby_created', CATEGORIES.ROOM, roomName);
    };

    if (loadRoom) {
      const lobby = room.conversations.find(c => c.convoNumber === 0);
      if (!lobby) {
        createLobby();
      } else {
        if (!amIInThisConvo(lobby)) {
          RoomActions.addParticipant(lobby, me)(dispatch);
        }
      }
    }
  }, [loadRoom, lastRefreshed, me]);

  useEffect(() => {
    if (maximizedConvo) {
      window.scrollTo(0, 0);
    }
  }, [maximizedConvo]);


  return (
    <div style={{ textAlign: 'center' }}>
      {!roomName &&
        <Jumbotron>Looks like you landed here by accident, <a href="/">click here to try again</a>.</Jumbotron>
      }
      {roomName &&
        <>
          {!loadRoom &&
            <LoginForm roomName={roomName} onOpen={openRoom} />
          }
          {
            loadRoom && room.conversations[0] &&
            <>
              <Header fluid />
              {!maximizedConvo &&
                <Container fluid>
                  <Row>
                    <LobbyConvo convo={room.conversations[0]} />
                  </Row>
                </Container>
              }
              <Container>
                <Row id="conversations">
                  {!maximizedConvo && room.conversations[0] && room.enableConvo && <CreateConversation conversations={room.conversations} roomName={roomName} />}
                  {room.conversations
                    .filter(c => c.convoNumber !== lobbyNumber)
                    .map(convo => {
                      const isMaximized = maximizedConvo && convo.convoNumber === maximizedConvo.convoNumber;
                      if ((maximizedConvo && isMaximized) || !maximizedConvo) {
                        return (
                          <Col md={isMaximized ? 12 : 4}>
                            <Conversation
                              convo={convo}
                              onLeave={leaveConvo}
                              onJoin={(c) => setMaximizedConvo(c)}
                              onMaximize={(c) => setMaximizedConvo(c)}
                              onMinimize={() => setMaximizedConvo(null)}
                              isMaximized={isMaximized}
                              key={convo.convoNumber}
                            />
                          </Col>
                        );
                      } else {
                        return null;
                      }
                    })
                  }
                </Row>
              </Container>
            </>
          }
        </>
      }
    </div >
  )
}

export default Room;