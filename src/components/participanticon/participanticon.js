import React from 'react';
import { PeopleCircle } from 'react-bootstrap-icons';


import './participanticon.scss';

const ParticipantIcon = ({ participant }) => {
  return (
    <div className='participanticon' style={{color: participant.color}}>
      {/* {participant.name.substring(0,1).toUpperCase()} */}
      <PeopleCircle className="person" />
    </div>
  )
};

export default ParticipantIcon;