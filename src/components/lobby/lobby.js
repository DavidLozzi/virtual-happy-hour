import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { name as ConvoName, actions as ConvoActions } from 'redux/api/conversations/conversations';

const Lobby = ({ match }) => {
  const dispatch = useDispatch();
  const roomName = match.params.roomName;
  const defaultWidth = 300;
  const defaultHeight = 300;
  const conversations = useSelector(state => state[ConvoName].conversations);
  const [convoCounter, setConvoCounter] = useState(0);
  const [convoApis, setConvoApis] = useState([]);
  const [enlargeConvo, setEnlargeConvo] = useState(null);
  const [loadRoom, setLoadRoom] = useState(false);
  const [myName, setMyName] = useState('');
  const [chats, setChats] = useState([]);
  const [createConvo, setCreateConvo] = useState(false);
  const [newConvoName, setNewConvoName] = useState('');
  const [currentConvo, setCurrentConvo] = useState(null);

  const createConversationOptions = () => ({
    height: defaultHeight,
    width: defaultWidth,
    generateRoom: true,
    roomNumber: convoCounter,
    roomName: `${roomName}-${convoCounter}`,
    roomTitle: newConvoName,
    roomCss: '',
    canResize: true,
    participants: []
  });

  const openRoom = () => {
    setLoadRoom(true);
  };

  const createRoomDone = () => {
    setNewConvoName('');
    setCreateConvo(false);
  };

  const createNewConversationClick = () => {
    addConvo(createConversationOptions(), myName);
    createRoomDone();
  };

  const createNewConversationOtherClick = () => {
    addConvo(Object.assign(createConversationOptions()), 'Luke Skywalker');
    createRoomDone();
  };

  const addConvo = (options, name) => {
    ConvoActions.add(options, name)(dispatch);
  };

  const joinConvo = (convo) => {
    ConvoActions.addParticipant(convo, myName)(dispatch);
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
    ConvoActions.removeParticipant(convo, myName)(dispatch);
    if (currentConvo.roomName === convo.roomName) setCurrentConvo(null);
  }

  useEffect(() => {
    const createLobby = () => {
      const options = Object.assign(
        createConversationOptions(),
        { // override the typical convo settings for the main lobby
          height: 600,
          width: 800,
          roomName,
          roomTitle: `The Lobby for ${roomName}`,
          roomCss: { display: 'block' },
          canResize: false
        }
      );
      addConvo(options, myName);
    };

    if (loadRoom) createLobby();

  }, [loadRoom]);

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

  const amIInThisConvo = (convo) => convo.participants.find(p => p === myName);

  useEffect(() => {
    setTimeout(() => {
      const convo = conversations.filter(c => c.roomNumber === convoCounter)[0];

      if (convo) {
        const newOptions = Object.assign(convo,
          {
            generateRoom: false,
            parentNode: document.getElementById(convo.roomName)
          }
        );

        if (amIInThisConvo(convo)) {
          // eslint-disable-next-line no-undef
          const api = new JitsiMeetExternalAPI('meet.jit.si', newOptions);
          api.executeCommands({
            toggleAudio: true,
            displayName: myName
          })

          api.addEventListener('audioMuteStatusChanged', ({ muted }) => muteStatusChanged(convo, muted))
          setConvoApis(a => a.concat({ roomName: convo.roomName, api }));
          setConvoCounter(convoCounter + 1);
          setChats(c => c.concat(api));
        }
      }
    }, 500);
  }, [conversations, convoCounter, currentConvo]);

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
          iFrame.style.width = `${defaultWidth}px`;
          iFrame.style.height = `${defaultHeight}px`;
        })
    }
  }, [enlargeConvo]);

  return (
    <div style={{ textAlign: 'center' }}>
      {!loadRoom &&
        <div>
          <h3>To join the {roomName} room, please provide:</h3>
            Name:
            <input value={myName} onChange={e => setMyName(e.target.value)} />
          <button onClick={openRoom}>Let's do this</button>
        </div>
      }
      {loadRoom &&
        <>
          <div>
            {!createConvo &&
              <button onClick={() => { setCreateConvo(true); setNewConvoName(`Convo with ${myName}`); }}>Create New Convo</button>
            }
            {createConvo &&
              <>
                Name: <input value={newConvoName} onChange={e => setNewConvoName(e.target.value)} />
                <button onClick={createNewConversationClick}>Create new Conversation</button>
                <button onClick={createNewConversationOtherClick}>Another User Creates Conversation</button>
              </>
            }
          </div>
          <div className="conversations">
            {conversations.map(convo => {
              const isSelected = enlargeConvo && enlargeConvo.roomName === convo.roomName;
              let roomCss = Object.assign({ display: 'inline-block', margin: '10px' }, convo.roomCss);
              if (isSelected) {
                roomCss = Object.assign(roomCss, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'white' })
              }
              const imInThisConvo = amIInThisConvo(convo);
              return (
                <div key={convo.roomName} style={roomCss}>
                  {isSelected && <button onClick={() => setEnlargeConvo(null)}>close</button>}
                  <h3>{convo.roomTitle}</h3>
                  {!isSelected && convo.canResize && imInThisConvo && <button onClick={() => setEnlargeConvo(convo)}>enlarge</button>}
                  {imInThisConvo && convo.generateRoom ? 'loading...' : null}
                  {imInThisConvo && <div id={convo.roomName} />}
                  {!imInThisConvo && <button onClick={() => joinConvo(convo)}>join the conversation</button>}
                  <h4>Who's here:</h4>
                  {imInThisConvo && 'Me'}
                  {convo.participants
                    .filter(p => p !== myName)
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