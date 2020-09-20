import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Pencil, Bookmark, BookmarkCheck } from 'react-bootstrap-icons';
import FormControl from 'components/formcontrol/formcontrol';
import { Button, InputGroup, Form } from 'react-bootstrap';

import { name as MeName } from 'redux/api/me/me';
import { actions as RoomActions } from 'redux/api/room/room';
import analytics, { CATEGORIES } from 'analytics/analytics';
import CreateConversation from 'components/createconversation/createconversation';

import './conversationlist.scss';

const ConversationList = ({ room, onJoin }) => {
  const dispatch = useDispatch();
  const primaryConvoNumber = useSelector(state => state[MeName].participant.primaryConvoNumber);
  const me = useSelector(state => state[MeName].participant);
  const [iAmHost, setIAmHost] = useState(false);

  const [validated, setValidated] = useState(false);
  const [editName, setEditName] = useState(false);
  const [convoObj, setConvoObj] = useState({});
  const [convoName, setConvoName] = useState('');
  const roomRef = useRef(room);
  roomRef.current = room;

  const persistConvo = (event, convo) => {
    event.stopPropagation();
    RoomActions.updateConvoProperty(convo, 'persist', true)(dispatch);
    analytics.event('persisted', CATEGORIES.CONVO);
  };

  const unpersistConvo = (event, convo) => {
    event.stopPropagation();
    RoomActions.updateConvoProperty(convo, 'persist', false)(dispatch);
    analytics.event('unpersist', CATEGORIES.CONVO);
  };

  const closeEditForm = () => {
    setConvoObj({});
    setEditName(false);
    setValidated(false);
  };

  const updateConvoName = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity()) {
      RoomActions.updateConvoProperty(convoObj, 'roomTitle', convoName)(dispatch);
      analytics.event('renamed', CATEGORIES.CONVO);
      closeEditForm();
    } else {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  useEffect(() => {
    if (room.hosts.some(h => h.userId === me.userId)) {
      setIAmHost(true);
    } else {
      setIAmHost(false);
    }

  }, [room, me]);

  useEffect(() => {
    if (primaryConvoNumber !== 0) {
      setTimeout(() => {
        if (roomRef.current.participants.filter(p => p.primaryConvoNumber === primaryConvoNumber).length === 1) {
          toast('All alone? Click someone\'s name to invite them!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }, 5000);
    }
  }, [primaryConvoNumber]);

  return <>
    <h5>All Conversations</h5>
    <div id="conversationList">
      {room.conversations.map(convo => {
        const participantList = room.participants.filter(p => p.primaryConvoNumber === convo.convoNumber);

        return (
          <div key={convo.convoNumber} onClick={() => { onJoin(convo) }} className="convoItem">
            {convo.roomTitle}
            {convo.convoNumber === primaryConvoNumber &&
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="mine">You're in this conversation now</Tooltip>}
              >
                <Badge variant="info">mine</Badge>
              </OverlayTrigger>}
            {convo.convoNumber !== primaryConvoNumber &&
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="people">Click to join this conversation</Tooltip>}
              >
                <Badge variant="success" size={25}>join</Badge>
              </OverlayTrigger>}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="people">
                {participantList.length === 0 && 'No one is in this conversation, yet. Click to join.' }
                {participantList.length > 0 && <>People in this conversation {participantList.map(p => <div key={p.userId}>{p.name}</div>)}</>}
              </Tooltip>}
            >
              <Badge variant="primary">{participantList.length}</Badge>
            </OverlayTrigger>
            { iAmHost && convo.convoNumber !== 0 &&
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="persist">Let this room persist after people have left</Tooltip>}
                  >
                    { convo.persist ? <BookmarkCheck className="icon persist" onClick={(e) => unpersistConvo(e, convo)}/> : <Bookmark className="icon text-muted" onClick={(e) => persistConvo(e, convo)}/> }
                  </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="edit">Edit the name of this room</Tooltip>}
                  >
                    <Pencil className="icon text-muted" onClick={(e) => { e.stopPropagation(); setConvoName(convo.roomTitle); setConvoObj(convo); setEditName(true); }} />
                  </OverlayTrigger>
              </>
            }
          </div>
        )
      })}
    </div>
    {editName && 
    <div id="createconversation">
      <Form noValidate validated={validated} onSubmit={updateConvoName}>
        <Form.Row>
          <Form.Group controlId="validationConvoName">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                placeholder="Conversation Name"
                aria-label="Conversation Name"
                value={convoName}
                onChange={e => setConvoName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">C'mon, you need to name it!</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form.Row>
        <Button variant="outline-secondary" type="submit">Update</Button>
        <Button variant="outline-secondary" onClick={closeEditForm}>Cancel</Button>
      </Form>
    </div>
    }
    {!editName && <CreateConversation room={room} /> }
  </>
};

export default ConversationList;