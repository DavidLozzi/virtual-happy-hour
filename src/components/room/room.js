import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName, actions as MeActions } from 'redux/api/me/me';

import LoginForm from 'components/loginform/loginform';
import Conversation from 'components/conversation/conversation';
import Header from 'components/header/header';

import './room.scss';
import { Container, Jumbotron } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [loadRoom, setLoadRoom] = useState(false);
  const [primaryConvo, setPrimaryConvo] = useState();

  const roomName = match.params.roomName;
  const lobbyNumber = 0;

  const openRoom = () => {
    setLoadRoom(true);
  };

  const refreshPage = () => {
    analytics.event('refresh', CATEGORIES.ERROR);
    window.location.reload(true);
  }

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
      if (!room.hosts || room.hosts.length === 0) {
        RoomActions.addHost(roomName, me)(dispatch);
      }
    }
  }, [loadRoom, me, dispatch, roomName]);

  useEffect(() => {
    if (loadRoom) {
      const myConvo = room.conversations.filter(c => c.participants.some(p => p.email === me.email));
      if (myConvo && myConvo.length === 1) {
        setPrimaryConvo(myConvo[0]);
        MeActions.setPrimaryConvoNumber(myConvo[0].convoNumber)(dispatch);
      } else { // if it happens, there was an oopsy, send to lobby
        setPrimaryConvo(room.conversations.find(c => c.convoNumber === lobbyNumber));
      }
    }
  }, [room, loadRoom, me])


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
          {loadRoom && !room.conversations[0] &&
            <>
              <h3>Uh oh...</h3>
              <p>Don't you just hate it when this happens?</p>
              <p><div onClick={refreshPage} rel="button" class="errorLink">Click here to try again</div></p>
            </>
          }
        </>
      }
    </div >
  )
}

export default Room;