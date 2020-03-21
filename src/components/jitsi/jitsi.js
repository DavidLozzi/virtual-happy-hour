import React, { useEffect } from 'react';
import { Subject } from 'rxjs';
// import './external_api';

// TODO create new shared component outside of this project

export const JitsiSubject = new Subject();

const Jitsi = ({ options, commands }) => {

  useEffect(() => {
    const newOptions = Object.assign(options,
      {
        generateRoom: false,
        parentNode: document.getElementById(options.roomName)
      }
    );

    // eslint-disable-next-line no-undef
    const api = new JitsiMeetExternalAPI('meet.jit.si', newOptions);
    api.executeCommands(commands);

    JitsiSubject.next({ options: newOptions, api });
  }, []);

  return (
    <div id={options.roomName} />
  )
};

export default Jitsi;