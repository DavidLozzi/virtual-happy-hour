import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as ConvoName, actions as ConvoActions } from 'redux/api/conversations/conversations';
import { name as MeName } from 'redux/api/me/me';


import EntryForm from 'components/entryform/entryform';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import CreateConversation, { addConvo } from 'components/createconversation/createconversation';
import Sockets from 'components/sockets/sockets';

import './lobby.scss';

// MVP
// TODO have a host for the Lobby to control
//    mute all
//    notify all to come to lobby
//    enable/disbale creating convos

// Backlog
// TODO add invite option to allow me to invite someone into my convo

const Lobby = ({ match }) => {
  const dispatch = useDispatch();
  const roomName = match.params.roomName;
  const conversations = useSelector(state => state[ConvoName].conversations);
  const myEmail = useSelector(state => state[MeName].email);
  const myName = useSelector(state => state[MeName].name);
  const [convoApis, setConvoApis] = useState([]);
  const [enlargeConvo, setEnlargeConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);

  const openRoom = () => {
    setLoadRoom(true);
  };

  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: myName
  };

  const joinConvo = (convo) => {
    ConvoActions.addParticipant(convo, myEmail)(dispatch);
    removeMeFromOtherConvos(convo);
    setTimeout(() => setEnlargeConvo(convo), 1000);
  };

  const removeMeFromOtherConvos = (convo) => {
    ConvoActions.removeMeFromOtherConvos(convo, myEmail)(dispatch);
  }

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

  const addConvoApi = (options, api) => {
    console.log('checking on api', options.roomName);
    const apis = convoApis;
    if (apis && !apis.find(o => o.roomName === options.roomName)) {
      // setApiEvents(api, options);
      apis.push({ roomName: options.roomName, api });
      console.log('added api', options.roomName);
      setConvoApis(apis);
    }
  };

  JitsiSubject.subscribe({
    next: ({ options, api }) => addConvoApi(options, api)
  });

  useEffect(() => {
    ConvoActions.getFromApi(roomName)(dispatch);
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
      if (!conversations.find(c => c.convoNumber === 0)) {
        createLobby();
      } else {
        if (!amIInThisConvo(conversations.find(c => c.convoNumber === 0))) {
          ConvoActions.addParticipant(conversations.find(c => c.convoNumber === 0), myEmail)(dispatch);
        }
      }
    }
  }, [loadRoom]);

  useEffect(() => {
    if (enlargeConvo) {
      window.scrollTo(0, 0);
    }
  }, [enlargeConvo]);


  return (
    <div style={{ textAlign: 'center' }}>
      {!loadRoom &&
        <EntryForm roomName={roomName} onOpen={openRoom} />
      }
      {loadRoom &&
        <>
          {conversations[0] && <CreateConversation conversations={conversations} roomName={roomName} />}
          <div id="conversations">
            {conversations.map(convo => {
              const isEnlarged = enlargeConvo && enlargeConvo.roomName === convo.roomName;
              const imInThisConvo = amIInThisConvo(convo);
              const isLobby = convo.convoNumber === 0;
              const canEnlarge = !isEnlarged && convo.canResize && imInThisConvo;
              return ( // TODO refactor below to a new convo component, and make one for lobby wrapping convo
                <div key={convo.roomName} className={`convoWrapper ${isLobby ? 'lobbyWrapper' : ''} ${isEnlarged ? 'enlargedWrapper' : ''}`}>
                  {isEnlarged && <><button onClick={() => setEnlargeConvo(null)}>close</button><br/></> }
                  <h3>{convo.roomTitle}</h3>
                  {canEnlarge && <><button onClick={() => setEnlargeConvo(convo)}>enlarge</button><br/></>}
                  {imInThisConvo && <Jitsi
                    options={{ ...convo }}
                    commands={defaultJitsiCommands}
                    className={`${isLobby ? 'lobby' : ''} ${isEnlarged ? 'enlarged' : ''}`}
                    mute={true}
                    />}
                  {!imInThisConvo && <button onClick={() => joinConvo(convo)}>join the conversation</button>}
                  <h4>Who's here:</h4>
                  {convo.participants
                    .map((parti => (
                      <div key={parti}>{parti === myEmail ? 'Me - ' : ' '}
                      {parti}
                      {(isLobby && convo.hosts.find(h => h === parti)) ? ' (HOST)' : ''}</div>
                    )))}
                </div>
              )
            })
            }
          </div>
        </>
      }
      <Sockets />
    </div >
  )
}

export default Lobby;