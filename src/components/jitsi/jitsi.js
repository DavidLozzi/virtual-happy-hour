import React, { useEffect, useState, useContext } from 'react';
import { Subject } from 'rxjs';

import { BrandContext } from 'brands/BrandContext';

import './jitsi.scss';
// TODO create new shared component outside of this project

export const JitsiSubject = new Subject();

const Jitsi = ({ options, convoNumber, user }) => {
  const [jitsiApi, setJitsiApi] = useState();
  const brand = useContext(BrandContext);

  useEffect(() => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi();
      console.log('destroyed jitsi');
    }
    console.log('building jitsi');
    const newOptions = Object.assign(options,
      { // https://github.com/jitsi/handbook/blob/cd87aa7d693fc6491554bdd7a6c375536086d83d/docs/dev-guide/iframe.md
        roomName: `${brand.title} - ${options.roomTitle}`,
        userInfo: {
          userId: user.userId,
          displayName: user.name
        },
        generateRoom: false,
        parentNode: document.getElementById('play-here'),
        configOverwrite: { // https://github.com/jitsi/jitsi-meet/blob/master/config.js
          gatherStats: false,
          localRecording: {
            enabled: true,
            format: 'flac'
          },
          enableCalendarIntegration: false,
          prejoinPageEnabled: false
        },
        interfaceConfigOverwrite: { // https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: true,
          APP_NAME: brand.title,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', '-hangup', '-profile', '-info', 'chat', '-recording',
            '-livestreaming', '-etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', '-invite', '-feedback', '-stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', '-mute-everyone','localrecording'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', '-moderator', 'profile', '-calendar'],
          // MOBILE_APP_PROMO: false, // if this is enabled then it removes the app download need, but then errors
          SUPPORT_URL: 'http://remoteparty.social'
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