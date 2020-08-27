import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName } from 'redux/api/me/me';

import LoginForm from 'components/loginform/loginform';
import Conversation from 'components/conversation/conversation';
import Header from 'components/header/header';
import Help from 'components/help/help';

import { BrandContext } from 'brands/BrandContext';
import { Jumbotron } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './room.scss';

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const brand = useContext(BrandContext);
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [loadRoom, setLoadRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryConvo, setPrimaryConvo] = useState();
  const [updatePrimaryConvo, setUpdatePrimaryConvo] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const roomName = `${brand.title} - ${match.params.roomName}`;
  const lobbyNumber = 0;

  const openRoom = () => {
    setLoadRoom(true);
  };

  const refreshPage = () => {
    analytics.error('page error', CATEGORIES.ROOM, 'refresh was pressed');
    window.location.reload(true);
  }

  useEffect(() => {
    window.document.title = brand.title;
  }, [brand]);

  useEffect(() => {
    if (roomName && brand.title) {
      RoomActions.setRoom(roomName)(dispatch);
      RoomActions.listen()(dispatch);
      analytics.pageView(roomName, `room ${roomName}`);
    } else {
      analytics.pageView('none', 'no room');
    }
  }, [roomName, dispatch, brand.title])

  useEffect(() => {
    const createLobby = () => {
      const lobbyConvo = CONFIG.CONVERSATION_DEFAULTS(0, roomName, 'Lobby', brand.title);
      RoomActions.addConvo(lobbyConvo, me)(dispatch);
      RoomActions.addHost(roomName, me)(dispatch); // if this user is creating the lobby, they're the host
      analytics.nonInteractionEvent('lobby_created', CATEGORIES.ROOM, roomName);
      return lobbyConvo;
    };

    if (loadRoom) {
      let lobby = room.conversations.find(c => c.convoNumber === 0);
      if (!lobby) {
        lobby = createLobby();
      } else {
        if (!room.hosts || room.hosts.length === 0) {
          RoomActions.addHost(roomName, me)(dispatch);
        }
        if (
          !room.participants ||
          !room.participants.some(p => p.userId === me.userId) ||
          (room.participants.some(p => p.userId === me.userId) && !room.participants.some(p => p.id === me.id))
        ) {
          RoomActions.addParticipant(lobby, me)(dispatch);
        }
      }
      // setShowHelp(true);
      setUpdatePrimaryConvo(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRoom, dispatch, roomName]);

  useEffect(() => {
    if (updatePrimaryConvo) {
      if (!me || !me.name || !me.userId) window.location.reload();
      const myConvo = room.conversations.find(c => c.convoNumber === me.primaryConvoNumber);
      if (myConvo) {
        setPrimaryConvo(myConvo);
      } else {
        setPrimaryConvo(room.conversations.find(c => c.convoNumber === lobbyNumber));
      }
      setIsLoading(false);
    }
  }, [room, updatePrimaryConvo, me])

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
          {loadRoom &&
            <>
              <Header fluid />
              {isLoading &&
                <h3>loading, please wait</h3>
              }
              {!isLoading &&
                <>
                  {
                    primaryConvo &&
                    <Conversation convo={primaryConvo} room={room} />
                  }
                  {!primaryConvo &&
                    <>
                      <h3>Uh oh...</h3>
                      <p>Don't you just hate it when this happens?</p>
                      <div onClick={refreshPage} rel="button" className="errorLink">Click here to try again</div>
                    </>
                  }
                </>
              }
              <Help show={showHelp} onHide={() => setShowHelp(false)} />
            </>
          }
        </>
      }
    </div >
  )
}

export default Room;