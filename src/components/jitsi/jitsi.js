import React, { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
// import './external_api';
import './jitsi.scss';
// TODO create new shared component outside of this project

export const JitsiSubject = new Subject();

// TODO gotta support mobile browser
const Jitsi = ({ options, commands, mute, className }) => {

  useEffect(() => {
    const newOptions = Object.assign(options,
      {
        roomName: options.convoName,
        generateRoom: false,
        parentNode: document.getElementById(options.convoName),
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: true,
          APP_NAME: 'Vitual Happy Hour',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', '-hangup', '-profile', '-info', 'chat', 'recording',
            '-livestreaming', '-etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', '-invite', '-feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', '-mute-everyone'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', '-moderator', 'profile', '-calendar'],
          // MOBILE_APP_PROMO: false, // if this is enabled then it removes the app download need, but then errors
          SUPPORT_URL: 'http://davidlozzi.com'
        }
      }
    );

    // eslint-disable-next-line no-undef
    const api = new JitsiMeetExternalAPI('meet.jit.si', newOptions);

    api.addEventListener('audioMuteStatusChanged', ({ muted }) => JitsiSubject.next({ type: 'mute', convo: options }));
    api.executeCommands(commands);

    const iframe = window.document.getElementById(options.convoName).getElementsByTagName('iframe')[0];
    iframe.style = 'border: 0';

    // JitsiSubject.next({ type: 'new', options: newOptions, api });

    JitsiSubject.subscribe(({type, convo}) => {
      if (type === 'mute') {
        if (convo.convoName !== options.roomName) {
          api.isAudioMuted().then(muted => {
            if (!muted) {
              api.executeCommand('toggleAudio');
            }
          });
        }
      }
    });

  }, []);

  return (
    <div id={options.convoName} className={`convo ${className} ${mute ? 'muted' : ''}`} />
  )
};

export default Jitsi;