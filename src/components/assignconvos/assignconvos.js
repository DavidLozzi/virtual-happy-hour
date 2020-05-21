import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { Button, OverlayTrigger, Popover, Dropdown, Modal, Form } from 'react-bootstrap';
import analytics, { CATEGORIES } from 'analytics/analytics';
import CONFIG from 'config';

const AssignConvos = () => {
  const dispatch = useDispatch();
  const room = useSelector(state => state[RoomName].room);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignNumber, setAssignNumber] = useState(5);
  const [assignRoomList, setAssignRoomList] = useState('Movies\nTV\nPets\nCooking\nHome Improvement\nExercise\nCoffee\nFamily\nGadgets');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [totalConvos, setTotalConvos] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [lobby, setLobby] = useState();

  useEffect(() => {
    const lobbyConvo = room.conversations.find(c => c.convoNumber === 0);
    const partiCount = lobbyConvo.participants.length;
    setLobby(lobbyConvo);
    setParticipantCount(partiCount);
  }, [room]);

  useEffect(() => {
    setTotalConvos(Math.ceil(participantCount / assignNumber))
  }, [assignNumber, participantCount]);

  const showAssign = () => {
    analytics.event('Open Assign to Convos', CATEGORIES.HOST_CONTROLS);
    setShowAssignModal(true);
  };

  const hideAssign = () => {
    analytics.event('Close Assign to Convos', CATEGORIES.HOST_CONTROLS);
    setShowAssignModal(false);
  };

  const sortByconvoNumber = (a, b) => {
    if (a.convoNumber > b.convoNumber) {
      return 1;
    } else {
      return -1;
    }
  };

  const assignToConvos = () => {
    setIsProcessing(true);
    analytics.event('Assign to Convos', CATEGORIES.HOST_CONTROLS);
    if (participantCount <= assignNumber) {
      setStatusMessage('The number of people per conversation exceeds the number of people in the lobby');
      setIsProcessing(false);
    } else {
      const peopleList = [...lobby.participants]; // maybe entire room instead?
      const convoNames = assignRoomList.split('\n');
      let convoNumber = room.conversations.sort(sortByconvoNumber).splice(-1)[0].convoNumber + 10; // just feels right to go further out
      const newConvoNumbers = [];
      let newConvo;

      setStatusMessage('Creating conversations');
      for (let i = 1; i <= totalConvos; i++) {
        if (peopleList.length === 0) break;
        const randomPersonIndex = Math.round(Math.random()) * (peopleList.length - 1);
        const randomPerson = peopleList.splice(randomPersonIndex, 1)[0];
        const randomConvoIndex = Math.round(Math.random()) * (convoNames.length - 1);
        const randomConvoName = convoNames.splice(randomConvoIndex, 1)[0];
        console.log('create convo', randomPerson, randomConvoName, convoNumber);
        newConvo = CONFIG.CONVERSATION_DEFAULTS(convoNumber, room.roomName, randomConvoName, [randomPerson])
        newConvoNumbers.push(convoNumber);
        convoNumber++;
        RoomActions.addConvo(newConvo)(dispatch);
        analytics.event('created_convo', CATEGORIES.HOST_CONTROLS, `${randomConvoName}`);
      }

      setStatusMessage('Assigning everyone to conversations');
      for (let i = 0; i < newConvoNumbers.length; i++) {
        if (peopleList.length === 0) break;
        let randomPersonIndex = 0;
        if (peopleList.length > 1) {
          randomPersonIndex = Math.round(Math.random()) * (peopleList.length - 1);
        }
        const randomPerson = peopleList.splice(randomPersonIndex, 1)[0];
        console.log('add participant', newConvoNumbers[i], randomPerson);
        RoomActions.addParticipant({ roomName: room.roomName, convoNumber: newConvoNumbers[i] }, randomPerson)(dispatch);
        analytics.event('join_convo', CATEGORIES.HOST_CONTROLS);

        if (i === newConvoNumbers.length - 1) {
          i = 0;
        }
      }
      setStatusMessage('');
      setIsProcessing(false);
      setShowAssignModal(false);
      setAssignNumber(5);
    }
  };

  return (
    <>
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Popover id="popover">
          <Popover.Content>
            Click to assign everyone to random conversations
        </Popover.Content>
        </Popover>}
      >
        <Dropdown.Item variant="primary" onClick={showAssign}>Assign to Conversations</Dropdown.Item>
      </OverlayTrigger>
      <Modal
        show={showAssignModal}
        onHide={hideAssign}
      >
        <Modal.Header closeButton>Assign all people in lobby to new conversations</Modal.Header>
        <Modal.Body>
          <p>{statusMessage}</p>
          {!isProcessing &&
            <Form>
              <Form.Group controlId="formnumberofpeople">
                <Form.Label>Number of people per conversation</Form.Label>
                <Form.Text>There are {participantCount} people in the lobby, specify how many people you'd like in each conversation.</Form.Text>
                <Form.Control
                  placeholder="# people / conversations"
                  value={assignNumber}
                  onChange={e => setAssignNumber(e.target.value)}
                />
                <Form.Text className="text-muted">
                  We recommend about 5 people per conversation to help enable meaningful connections
                </Form.Text>
                <Form.Text>
                  {assignNumber < participantCount &&
                    <>
                      {assignNumber > 1 &&
                        <>At {assignNumber} people, this will create {totalConvos} conversations.</>
                      }
                      {assignNumber === 1 &&
                        <>C'mon, they can't talk by ourselves, select a number greater than 1 please.</>
                      }
                    </>
                  }
                  {assignNumber >= participantCount &&
                    <>The number of people per conversation exceeds the number of people in the lobby</>
                  }
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formlistofnames">
                <Form.Label>Conversation Names</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="6"
                  value={assignRoomList}
                  onChange={e => setAssignRoomList(e.target.value)}
                  placeholder=""
                />
                <Form.Text className="text-muted">Enter conversation names one per line. These names can help spark conversations.</Form.Text>
              </Form.Group>
            </Form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={assignToConvos}>
            Create Conversations
      </Button>
        </Modal.Footer>
      </Modal>
    </>
  )

};

export default AssignConvos;