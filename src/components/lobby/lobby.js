import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CONFIG from 'config';
import { name as ConvoName, actions as ConvoActions } from 'redux/api/conversations/conversations';
import { name as MeName } from 'redux/api/me/me';


import EntryForm from 'components/entryform/entryform';
import Jitsi, { JitsiSubject } from 'components/jitsi/jitsi';
import CreateConversation, { addConvo } from 'components/createconversation/createconversation';

const Lobby = ({ match }) => {
  const dispatch = useDispatch();
  const roomName = match.params.roomName;
  const conversations = useSelector(state => state[ConvoName].conversations);
  const myEmail = useSelector(state => state[MeName].email);
  const myName = useSelector(state => state[MeName].name);
  const [convoApis, setConvoApis] = useState([]);
  const [enlargeConvo, setEnlargeConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);
  const [currentConvo, setCurrentConvo] = useState(null);

  const openRoom = () => {
    setLoadRoom(true);
  };

  const onConvoCreate = (convo) => {
    setCurrentConvo(convo);
  };

  const defaultJitsiCommands = {
    toggleAudio: true,
    displayName: myName
  };

  const joinConvo = (convo) => {
    ConvoActions.addParticipant(convo, myEmail)(dispatch);
    removeFromAllOtherConvos(convo);
    setCurrentConvo(convo);
    setTimeout(() => setEnlargeConvo(convo), 1000);
  };

  const removeFromAllOtherConvos = (convo) => {
    conversations.forEach(c => {
      if (c.roomName !== roomName && c.roomName !== convo.roomName) {
        removeMeFromThisConvo(c);
      }
    })
  };

  const removeMeFromThisConvo = (convo) => {
    ConvoActions.removeParticipant(convo, myEmail)(dispatch);
    if (currentConvo.roomName === convo.roomName) setCurrentConvo(null);
  }

  const muteStatusChanged = (convo, muted) => {
    console.log('muted', muted, convo.roomName);
    muteAllOtherRooms(convo);
  };

  const muteAllOtherRooms = (convoToKeepUnmuted) => {
    conversations
      .filter(c => c.roomName !== convoToKeepUnmuted.roomName)
      .forEach(convo => {
        const { api } = convoApis.filter(a => a.roomName === convo.roomName)[0];
        api.isAudioMuted().then(muted => {
          if (!muted) {
            api.executeCommand('toggleAudio');
          }
        })
      })
  }

  const amIInThisConvo = (convo) => convo.participants.find(p => p === myEmail);

  const addConvoApi = (options, api) => {
    console.log('checking on api', options.roomName);
    const apis = convoApis;
    if (apis && !apis.find(o => o.roomName === options.roomName)) {
      apis.push({ roomName: options.roomName, api });
      console.log('added api', options.roomName);
      setConvoApis(apis);
    }
  };

  JitsiSubject.subscribe({
    next: ({ options, api }) => addConvoApi(options, api)
  });

  useEffect(() => {
    const createLobby = () => {
      const options = Object.assign(
        CONFIG.CONVERSATION_DEFAULTS(0, roomName, `Lobby for ${roomName}`),
        { // override the typical convo settings for the main lobby
          height: 600,
          width: 800,
          roomCss: { display: 'block' },
          canResize: false
        }
      );
      addConvo(options, myEmail, dispatch);
      setCurrentConvo(options);
    };

    if (loadRoom) createLobby();

  }, [loadRoom]);
  
  useEffect(() => {
    if (enlargeConvo) {
      const iFrame = document.getElementById(enlargeConvo.roomName).getElementsByTagName('iframe')[0];
      iFrame.style.width = '800px';
      iFrame.style.height = '600px';
    } else {
      conversations
        .filter(c => c.canResize)
        .forEach(convo => {
          const iFrame = document.getElementById(convo.roomName).getElementsByTagName('iframe')[0];
          iFrame.style.width = `${CONFIG.CONVERSATION_DEFAULTS.width}px`;
          iFrame.style.height = `${CONFIG.CONVERSATION_DEFAULTS.height}px`;
        })
    }
  }, [enlargeConvo]);


  return (
    <div style={{ textAlign: 'center' }}>
      {!loadRoom &&
        <EntryForm roomName={roomName} onOpen={openRoom} />
      }
      {loadRoom &&
        <>
          {conversations[0] && <CreateConversation onCreate={onConvoCreate} roomName={roomName} />}
          <div className="conversations">
            {conversations.map(convo => {
              const isSelected = enlargeConvo && enlargeConvo.roomName === convo.roomName;
              let roomCss = Object.assign({ display: 'inline-block', margin: '10px' }, convo.roomCss);
              if (isSelected) {
                roomCss = Object.assign(roomCss, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: '#ddddff' })
              }
              const imInThisConvo = amIInThisConvo(convo);
              return (
                <div key={convo.roomName} style={roomCss}>
                  {isSelected && <button onClick={() => setEnlargeConvo(null)}>close</button>}
                  <h3>{convo.roomTitle}</h3>
                  {!isSelected && convo.canResize && imInThisConvo && <button onClick={() => setEnlargeConvo(convo)}>enlarge</button>}
                  {imInThisConvo && convo.loading ? 'loading...' : null}
                  {imInThisConvo && <Jitsi options={{...convo}} commands={defaultJitsiCommands} />}
                  {!imInThisConvo && <button onClick={() => joinConvo(convo)}>join the conversation</button>}
                  <h4>Who's here:</h4>
                  {imInThisConvo && 'Me'}
                  {convo.participants
                    .filter(p => p !== myEmail)
                    .map((parti => (
                      <div key={parti}>{parti}</div>
                    )))}
                </div>
              )
            })
            }
          </div>
        </>
      }
    </div >
  )


}

export default Lobby;