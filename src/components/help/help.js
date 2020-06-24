import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const Help = (props) => {
  const [page, setPage] = useState(1);
  return (
    <Modal
      size="lg"
      centered
      {...props}
    >
      <Modal.Body>
        {page === 1 &&
          <>
            <h3>Using Virtual Happy Hour</h3>
            <p>We're glad you're here! Using Virtual Happy Hour is really simple, I promise! But first, an important concept:</p>
            <p><strong>Conversations</strong> are similar to break out rooms. They allow anyone to leave the lobby to have
            a conversation with someone. Anyone can see all of the conversations in the room and jump into other conversations
            as they see fit.</p>
            <p>Just like a real happy hour!</p>
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Done</Button>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Help;