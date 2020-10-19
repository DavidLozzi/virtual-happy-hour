import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { Badge, Dropdown, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import dayjs from 'dayjs';
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
      .filter(m => m.to.userId === me.userId) : [];

    if (messageCount !== myMessages.length) {
      setMessageCount(myMessages.length);
      setMessages(myMessages);
      setLatestMessage(myMessages[0] && myMessages[0].message);
    }
  }, [room, me, messageCount])

  useEffect(() => {
    if (latestMessage) {
      const notif = new Audio('/new_message.mp3');
      notif.play();
      setTimeout(() => {
        setLatestMessage('');
      }, 4500)
    }
  }, [latestMessage]);

  const bellButton = React.forwardRef(({ children, onClick }, ref) => (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>You've Got Mail</Tooltip>}
    >
      <div
        className="bellWrapper"
        onClick={(e) => {
          analytics.event('bell', CATEGORIES.MESSAGES);
          e.preventDefault();
          onClick(e);
        }}
        rel="button">
        <BellFill
          className="icon"
        />
        <Badge variant="danger" pill className="count">{messageCount}</Badge>
      </div>
    </OverlayTrigger>
  ));

  return (
    <div id="messages">
      {latestMessage &&
        <Alert
          variant="info"
        >
          {ReactHtmlParser(latestMessage)}
        </Alert>
      }
      <>
        {messageCount > 0 &&
          <Dropdown drop="bottom">
            <Dropdown.Toggle as={bellButton} />
            <Dropdown.Menu>
              {messages.map(message => (
                <Dropdown.Item key={message.date}>{ReactHtmlParser(message.message)}<small className="text-muted"> at {dayjs(message.date).format('h:mm a')}</small></Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        }
        {messageCount === 0 &&
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>No Messages</Tooltip>}
          >
            <Bell className="icon" />
          </OverlayTrigger>
        }
      </>
    </div>
  )
}

export default Messages;