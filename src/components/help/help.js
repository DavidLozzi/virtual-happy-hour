import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { name as MeName } from 'redux/api/me/me';
import { name as RoomName } from 'redux/api/room/room';
import analytics, { CATEGORIES } from 'analytics/analytics';

import './help.scss';

const Help = (props) => {
  const me = useSelector(state => state[MeName].participant);
  const room = useSelector(state => state[RoomName].room);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const amIhost = room.hosts.some(h => h.userId === me.userId);
    setIsHost(amIhost);
    setTotalPages(amIhost ? 4 : 3);
  }, [me, room]);

  const previousPage = () => {
    analytics.event(`Previous ${page}`, CATEGORIES.HELP, room.roomName);
    setPage(page - 1);
  };

  const nextPage = () => {
    analytics.event(`Next ${page}`, CATEGORIES.HELP, room.roomName);
    setPage(page + 1);
  };

  const hideHelp = () => {
    analytics.event(`Hide ${page}`, CATEGORIES.HELP, room.roomName);
    if(props.onHide) props.onHide();
  }

  return (
    <Modal
      size="lg"
      centered
      id="help"
      {...props}
      onHide={hideHelp}
    >
      <Modal.Body>
        {page === 1 &&
          <>
            <h3>Welcome to Virtual Happy Hour!</h3>
            <p>I'm glad you're here! Using Virtual Happy Hour is really simple, I promise! But first, an important concept:</p>
            <p><strong>Conversations</strong>. Think of them similar to how you would at a real party, this is where you can
            have a conversation with as little or as many people as you'd like. Everyone starts in the lobby, and then you can break off
            into your own conversations.</p>
            <p>Just like a real happy hour!</p>
          </>
        }
        {page === 2 &&
          <>
            <h3>Have a Conversation!</h3>
            <p>On the right side, there is a little link called "Create New Conversation". Click that, give it a name
              and viola, you're in a new conversation!</p>
            <p>Once there, you can click on someone elses name from the list and invite them to your conversation. They'll
              get a little notification and can join when they want.
            </p>
          </>
        }
        {page === 3 && isHost &&
          <>
            <h3>You're a host!</h3>
            <p>As a host, you have some extra controls, obviously. Click the Host Controls button at the top right to explore
              your options. You can also make someone else a host just by clicking on their name.
            </p>
            <p>Feel the power!</p>
          </>
        }
        {((page === 4) || (page === 3 && !isHost) )&&
          <>
            <h3>Have fun!</h3>
            <p>Go get talking! If you have any feedback, suggestions, ideas, bugs, complaints, whatever it may be, I want
              to know! Click the Heart button at the top and let me know!
            </p>
            <p>Now go have fun!</p>
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <div className="pager">{page} / {totalPages}</div>
        {page > 1 &&
          <Button onClick={previousPage}>Previous</Button>
        }
        {page < totalPages &&
          <Button onClick={nextPage}>Next</Button>
        }
        <Button onClick={hideHelp}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Help;