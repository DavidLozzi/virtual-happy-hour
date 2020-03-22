import React, { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
// import './external_api';
import './jitsi.scss';
// TODO create new shared component outside of this project

export const JitsiSubject = new Subject();

const Jitsi = ({ options, commands, mute, className }) => {
  // const [api, setApi] = useState();

  useEffect(() => {
    const newOptions = Object.assign(options,
      {
        generateRoom: false,
        parentNode: document.getElementById(options.roomName)
      }
    );

    // eslint-disable-next-line no-undef
    const api = new JitsiMeetExternalAPI('meet.jit.si', newOptions);

    // api.addEventListener('audioMuteStatusChanged', ({ muted }) => muteStatusChanged(convo, muted));
    api.addEventListener('audioMuteStatusChanged', ({ muted }) => JitsiSubject.next({type: 'mute', roomName: options.roomName }));
    api.executeCommands(commands);

    const iframe = window.document.getElementById(options.roomName).getElementsByTagName('iframe')[0];
    iframe.style = 'border: 0';

    JitsiSubject.next({ type: 'new', options: newOptions, api });

    JitsiSubject.subscribe((data) => {
      if (data.type === 'mute') {
        api.isAudioMuted().then(muted => {
          if (!muted) {
            api.executeCommand('toggleAudio');
          }
        });
      }
    });

  }, []);

  useEffect(() => {
    console.log('mute', mute);
  }, [mute])

  return (
    <div id={options.roomName} className={`convo ${className} ${mute ? 'muted' : ''}`} />
  )
};

export default Jitsi;