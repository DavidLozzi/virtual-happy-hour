import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Badge, Dropdown, Alert } from 'react-bootstrap';
import moment from 'moment';
import { Bell, BellFill } from 'react-bootstrap-icons';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName } from 'redux/api/room/room';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './messages.scss';

// TODO clear a message, remove from messages array

const Messages = () => {
  const room = useSelector(state => state[RoomName].room);
  const me = useSelector(state => state[MeName].participant);
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState('');

  useEffect(() => {
    const myMessages = room.messages ? room.messages
      .filter(m => m.to.email === me.email) : [];

    if (messageCount !== myMessages.length) {
      setMessageCount(myMessages.length);
      setMessages(myMessages);
      setLatestMessage(myMessages[0] && myMessages[0].message);
    }
  }, [room, me, messageCount])

  useEffect(() => {
    if (latestMessage) {
      setTimeout(() => {
        setLatestMessage('');
      }, 4500)
    }
  }, [latestMessage]);

  const bellButton = React.forwardRef(({ children, onClick }, ref) => (
    <div
      class="bellWrapper"
      onClick={(e) => {
        analytics.event('bell', CATEGORIES.MESSAGES);
        e.preventDefault();
        onClick(e);
      }}
      rel="button">
      <BellFill
        size={25}
        className="icon"
      />
      <Badge variant="danger" pill className="count">{messageCount}</Badge>
    </div>
  ))
  return (
    <div id="messages">
      {latestMessage &&
        <Alert
          variant="info"
        >
          {latestMessage}
        </Alert>
      }
      {messageCount > 0 &&
        <Dropdown drop="left">
          <Dropdown.Toggle as={bellButton} />
          <Dropdown.Menu>
            {messages.map(message => (
              <Dropdown.Item key={message.date}>{message.message}<small className="text-muted"> at {moment(message.date).format('h:mm a')}</small></Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      }
      {messageCount === 0 &&
        <Bell size={25} className="icon" />
      }
    </div>
  )
}

export default Messages;