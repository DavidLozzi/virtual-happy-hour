import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';

import LoginForm from 'components/loginform/loginform';
import Conversation from 'components/conversation/conversation';
import Header from 'components/header/header';

import './room.scss';
import { Container, Row, Col, Jumbotron } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const primaryConvoNumber = useSelector(state => state[MeName].primaryConvoNumber);
  const [loadRoom, setLoadRoom] = useState(false);
  const [primaryConvo, setPrimaryConvo] = useState();

  const roomName = match.params.roomName;
  const lobbyNumber = 0;

  const openRoom = () => {
    setLoadRoom(true);
  };

  useEffect(() => {
    if (roomName) {
      analytics.pageView(roomName, `room ${roomName}`);
      RoomActions.setRoom(roomName)(dispatch);
      RoomActions.listen()(dispatch);
    } else {
      analytics.pageView('none', 'no room');
    }
  }, [roomName, dispatch])

  useEffect(() => {
    const createLobby = () => {
      const lobbyConvo = CONFIG.CONVERSATION_DEFAULTS(0, roomName, `Lobby for ${roomName}`, [me]);
      RoomActions.addConvo(lobbyConvo)(dispatch);
      RoomActions.addHost(roomName, me)(dispatch); // if this user is creating the lobby, they're the host
      analytics.nonInteractionEvent('lobby_created', CATEGORIES.ROOM, roomName);
      return lobbyConvo;
    };

    if (loadRoom) {
      let lobby = room.conversations.find(c => c.convoNumber === 0);
      if (!lobby) {
        lobby = createLobby();
      } 
      RoomActions.addParticipant(lobby, me)(dispatch);
      if(!room.hosts || room.hosts.length === 0) {
        RoomActions.addHost(roomName, me)(dispatch);
      }
    }
  }, [loadRoom, me, dispatch, roomName]);

  useEffect(() => {
    if (loadRoom) {
      const myConvo = room.conversations.filter(c => c.convoNumber === primaryConvoNumber);
      if (myConvo && myConvo.length === 1) {
        setPrimaryConvo(myConvo[0]);
      } else {
        setPrimaryConvo(room.conversations.find(c => c.convoNumber === lobbyNumber));
      }
    }
  }, [primaryConvoNumber, room, loadRoom])


  return (
    <div>
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
              <Container fluid>
                <Conversation convo={primaryConvo} room={room} />
              </Container>
            </>
          }
        </>
      }
    </div >
  )
}

export default Room;