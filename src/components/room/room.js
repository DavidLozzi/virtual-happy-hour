import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';

import mySocket from 'components/sockets/mySocket';
import RoomForm from 'components/roomform/roomform';
import LoginForm from 'components/loginform/loginform';
import CreateConversation, { addConvo } from 'components/createconversation/createconversation';
import Conversation from 'components/conversation/conversation';
import LobbyConvo from 'components/lobbyconvo/lobbyconvo';
import HostControls from 'components/hostcontrols/hostcontrols';

import './room.scss';
import { Container, Row } from 'react-bootstrap';

// Backlog
// TODO add invite option to allow me to invite someone into my convo

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state[RoomName].room.conversations);
  const me = useSelector(state => state[MeName].participant);
  const lastRefreshed = useSelector(state => state[RoomName].lastRefreshed);
  const [enlargeConvo, setEnlargeConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);

  const roomName = match.params.roomName;
  const lobbyNumber = 0;

  const openRoom = () => {
    setLoadRoom(true);
  };

  const amIInThisConvo = (convo) => convo && convo.participants.find(p => p.email === me.email);

  useEffect(() => {
    RoomActions.setRoom(roomName)(dispatch);
    RoomActions.listen()(dispatch);
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
    };

    if (loadRoom) {
      const lobby = conversations.find(c => c.convoNumber === 0);
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
    if (enlargeConvo) {
      window.scrollTo(0, 0);
    }
  }, [enlargeConvo]);


  return (
    <div style={{ textAlign: 'center' }}>
      {!roomName && // move this to a new page/container and update app.s for root path /
        <RoomForm />
      }
      {roomName &&
        <>
          {!loadRoom &&
            <LoginForm roomName={roomName} onOpen={openRoom} />
          }
          {
            loadRoom && conversations[0] &&
            <>
              <Container fluid>
                <Row>
                  <HostControls conversations={conversations} />
                  {conversations[0] && <CreateConversation conversations={conversations} roomName={roomName} />}
                  <LobbyConvo convo={conversations[0]} />
                </Row>
              </Container>
              <Container>
                <Row id="conversations">
                  {conversations
                    .filter(c => c.convoNumber !== lobbyNumber)
                    .map(convo => {
                      const isEnlarged = enlargeConvo && enlargeConvo.convoName === convo.convoName;
                      return (
                        <div className="col-md-4">
                          <Conversation convo={convo} isEnlarged={isEnlarged} setEnlargeConvo={setEnlargeConvo} key={convo.convoNumber} />
                        </div>
                      );
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