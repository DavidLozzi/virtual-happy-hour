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
import ParticipantIcon from 'components/participanticon/participanticon';

import './conversationgroups.scss';

const ConversationGroups = ({ room, onJoin }) => {
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

  const [convoCounts, setConvoCounts] = useState({});
  useEffect(() => {
    room.conversations.forEach(convo => {
      const participantCount = room.participants.filter(p => p.primaryConvoNumber === convo.convoNumber).length;
      const el = document.querySelector(`.circle-container.convo${convo.convoNumber} ul`);
      if (!convoCounts[convo.convoNumber]) setConvoCounts(cc => ({...cc, [convo.convoNumber]: participantCount }));

      Array.from(el.children).forEach((li, idx) => {
        const rot = idx * 360 / participantCount;
        li.style.transform = `translate(-50%, -50%) rotate(${rot}deg) translateY(-2.7rem) rotate(-${rot}deg)`;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.conversations, room.participants]);

  return <>
    <h5>All Conversations</h5>
    <div id="conversationList">
      {room.conversations.map((convo) => {
        const participantList = room.participants.filter(p => p.primaryConvoNumber === convo.convoNumber);
        const roomName = convo.roomTitle.length > 20 ? 
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="roomname">{convo.roomTitle}</Tooltip>}
              >
                <span>{convo.roomTitle.substring(0,17)}...</span>
              </OverlayTrigger>
            : convo.roomTitle;
  
        return (
          <div key={convo.convoNumber} onClick={() => { onJoin(convo) }} className="convoItem">
            <div className={`circle-container convo${convo.convoNumber} ${convo.convoNumber === primaryConvoNumber ? 'mine' : ''}`}>
              <ul>
                {participantList.filter((f, i) => i <= 12).map((p) => (
                  <OverlayTrigger
                    key={p.id}
                    placement="bottom"
                    overlay={<Tooltip id="participant">{p.name}</Tooltip>}
                  >
                    <li >
                      <ParticipantIcon participant={p} />
                    </li>
                  </OverlayTrigger>
                ))}
              </ul>	
              {roomName}
              <div className='actions top left'>
                { iAmHost && convo.convoNumber !== 0 &&
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="edit">Edit the name of this room</Tooltip>}
                  >
                    <Pencil className="icon text-muted" onClick={(e) => { e.stopPropagation(); setConvoName(convo.roomTitle); setConvoObj(convo); setEditName(true); }} />
                  </OverlayTrigger>
                }
              </div>
              <div className='actions top right'>
                { iAmHost && convo.convoNumber !== 0 &&
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="persist">Let this room persist after people have left</Tooltip>}
                    >
                      { convo.persist ? <BookmarkCheck className="icon text-muted persist" onClick={(e) => unpersistConvo(e, convo)}/> : <Bookmark className="icon text-muted presist" onClick={(e) => persistConvo(e, convo)}/> }
                    </OverlayTrigger>
              }
              </div>
              <div className='actions bottom right'>
                {convo.convoNumber !== primaryConvoNumber &&
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="join">Click to join this conversation</Tooltip>}
                >
                  <Badge variant="success" size={25}>join</Badge>
                </OverlayTrigger>}
              </div>
              <div className='actions bottom left'>
                  <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="people">
                    {participantList.length === 0 && 'No one is in this conversation, yet. Click to join.' }
                    {participantList.length > 0 && <>People in this conversation {participantList.map(p => <div key={p.userId}>{p.name}</div>)}</>}
                  </Tooltip>}
                >
                  <Badge variant="primary">{participantList.length}</Badge>
                </OverlayTrigger>
              </div>
            </div>            
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

export default ConversationGroups;