import React, { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import './jitsi.scss';
// TODO create new shared component outside of this project

export const JitsiSubject = new Subject();

const Jitsi = ({ options, convoNumber, user }) => {
  const [jitsiApi, setJitsiApi] = useState();

  useEffect(() => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi();
      console.log('destroyed jitsi');
    }
    console.log('building jitsi');
    const newOptions = Object.assign(options,
      {
        roomName: `Virtual Happy Hour - ${options.roomTitle}`,
        userInfo: {
          userId: user.userId,
          displayName: user.name
        },
        generateRoom: false,
        parentNode: document.getElementById('play-here'),
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: true,
          APP_NAME: 'Vitual Happy Hour',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', '-hangup', '-profile', '-info', 'chat', 'recording',
            '-livestreaming', '-etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', '-invite', '-feedback', '-stats', 'shortcuts',
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

    const iframe = window.document.getElementById('play-here').getElementsByTagName('iframe')[0];
    iframe.style = 'border: 0';
    setJitsiApi(api);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convoNumber]);

  return (
    <div id="play-here" className="convo" />
  )
};

export default Jitsi;