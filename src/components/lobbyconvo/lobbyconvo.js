import React from 'react';
import Conversation, { LAYOUTS } from 'components/conversation/conversation';
import './lobbyconvo.scss';
import HostControls from 'components/hostcontrols/hostcontrols';
import Counts from 'components/counts/counts';
import { Row } from 'react-bootstrap';

const LobbyConvo = ({ convo }) => {
  const options = {
    showHost: true
  };

  return (
    <div id="lobby" className="col-md-12">
      <Conversation
        convo={convo}
        options={options}
        layout={LAYOUTS.WIDE}
        viewOptions={{ showTitle: false }}
        topRight={
          <Row noGutters><HostControls /></Row>
        }
        bottomRight={
          <Row noGutters><Counts /></Row>
        }
      />
    </div>
  )
}

export default LobbyConvo;