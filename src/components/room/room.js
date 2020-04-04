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
import Sockets from 'components/sockets/sockets';

import './room.scss';

// Backlog
// TODO add invite option to allow me to invite someone into my convo

const Room = ({ match }) => {
  const dispatch = useDispatch();
  const roomName = match.params.roomName;
  const conversations = useSelector(state => state[RoomName].room.conversations);
  const myEmail = useSelector(state => state[MeName].email);
  const lastRefreshed = useSelector(state => state[RoomName].lastRefreshed);
  const [convoApis, setConvoApis] = useState([]);
  const [enlargeConvo, setEnlargeConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);
  const [convos, setConvos] = useState([]);

  const openRoom = () => {
    setLoadRoom(true);
  };

  // const muteStatusChanged = (convo, muted) => {
  //   console.log('mute changed', muted, convo.roomName);
  //   muteAllOtherRooms(convo);
  // };

  // const muteAllOtherRooms = (convoToKeepUnmuted) => {
  //   console.log('muting others except', convoToKeepUnmuted.roomName)
  //   conversations // this is undefined, issue with event listener in setApiEvents
  //     .forEach(convo => {
  //       console.log('checking mute ', convo.roomName);
  //       if (convo.roomName !== convoToKeepUnmuted.roomName) {
  //         const { api } = convoApis.filter(a => a.roomName === convo.roomName)[0];
  //         api.isAudioMuted().then(muted => {
  //           console.log('mute for', convo.roomName, muted)
  //           if (!muted) {
  //             api.executeCommand('toggleAudio');
  //           }
  //         })
  //       }
  //     })
  // }

  const amIInThisConvo = (convo) => convo && convo.participants.find(p => p === myEmail);

  // const setApiEvents = (api, convo) => {
  //   api.addEventListener('audioMuteStatusChanged', ({ muted }) => muteStatusChanged(convo, muted));
  // };

  // const addConvoApi = (options, api) => {
  //   // console.log('checking on api', options.roomName);
  //   const apis = convoApis;
  //   if (apis && !apis.find(o => o.roomName === options.roomName)) {
  //     // setApiEvents(api, options);
  //     apis.push({ roomName: options.roomName, api });
  //     console.log('added api', options.roomName);
  //     setConvoApis(apis);
  //   }
  // };

  // JitsiSubject.subscribe({
  //   next: ({ options, api }) => addConvoApi(options, api)
  // });

  useEffect(() => {
    RoomActions.setRoom(roomName)(dispatch);
    RoomActions.listen()(dispatch);
    // mySocket.on('RoomDetails', function(room) {
    //   setConvos(room.conversations)
    //   // RoomActions.saveRoom(room);
    //   console.log('RoomDetails received', room);
    // });
    mySocket.emit('SetRoom', roomName);
  }, [])

  useEffect(() => {
    const createLobby = () => {
      const options = Object.assign(
        CONFIG.CONVERSATION_DEFAULTS(0, roomName, `Lobby for ${roomName}`),
        { // override the typical convo settings for the main lobby
          height: 600,
          width: 800,
          canResize: false
        }
      );
      addConvo(options, myEmail, dispatch);
    };

    if (loadRoom) {
      const lobby = conversations.find(c => c.convoNumber === 0);
      if (!lobby) {
        createLobby();
      } else {
        if (!amIInThisConvo(lobby)) {
          RoomActions.addParticipant(lobby, myEmail)(dispatch);
        }
      }
    }
  }, [loadRoom, lastRefreshed]);

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
          <div style={{ background: 'white' }}><Sockets /></div>
          {!loadRoom &&
            <>
              <LoginForm roomName={roomName} onOpen={openRoom} />
              <div style={{background: 'white'}}>
                {conversations.map(convo => <div key={convo.convoNumber}>{convo.convoNumber}</div>)}
              </div>
            </>
          }
          {loadRoom && conversations[0] &&
            <div className="fullScreen">
              {conversations[0].hosts.find(h => h === myEmail) && <HostControls />}
              {conversations[0] && <CreateConversation conversations={conversations} roomName={roomName} />}
              <div id="conversations">
                {conversations.map(convo => {
                  const isEnlarged = enlargeConvo && enlargeConvo.roomName === convo.roomName;
                  if (convo.convoNumber === 0)
                    return <LobbyConvo convo={convo} key={convo.convoNumber} />
                  else {
                    return <Conversation convo={convo} isEnlarged={isEnlarged} setEnlargeConvo={setEnlargeConvo} key={convo.convoNumber} />
                  }
                })
                }
              </div>
            </div>
          }
        </>
      }
    </div >
  )
}

export default Room;