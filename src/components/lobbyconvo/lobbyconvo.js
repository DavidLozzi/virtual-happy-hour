import React from 'react';
import Conversation from 'components/conversation/conversation';
import './lobbyconvo.scss';

const LobbyConvo = ({ convo }) => {
  const options = {
    showHost: true
  };

  return (
    <div id="lobby">
      <Conversation
        convo={convo}
        options={options}
      />
    </div>
  )
}

export default LobbyConvo;