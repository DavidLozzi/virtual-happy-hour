import React from 'react';
import Conversation, { LAYOUTS } from 'components/conversation/conversation';
import './lobbyconvo.scss';

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
      />
    </div>
  )
}

export default LobbyConvo;