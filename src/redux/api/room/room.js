import mySocket from 'components/sockets/mySocket';
import { checkAndUpdatePrimaryConvoNumber } from 'utils/me';

export const API_CONVOS_LOAD_ROOM_SUCCESS = 'API_CONVOS_LOAD_ROOM_SUCCESS';
export const API_CONVOS_ERROR = 'API_CONVOS_ERROR';

export const name = 'room';

const initialState = {
  room: {
    conversations: []
  },
  loading: true,
  error: false,
  errorMessage: '',
  lastRefreshed: Date.now()
};

// TODO Need some level of error handling here

export const actions = {
  listen: () => async (dispatch) => {
    mySocket.on('RoomDetails', room => {
      dispatch({ type: API_CONVOS_LOAD_ROOM_SUCCESS, room });
      checkAndUpdatePrimaryConvoNumber();
    });
    mySocket.on('error', (error) => { // TODO alert users
      console.error('socket error', error);
      dispatch({ type: API_CONVOS_ERROR, error })
    });
  },
  setRoom: (roomName) => async (dispatch) => {
    // console.log('setRoom', roomName);
    dispatch({ type: 'API_CONVOS_SET_ROOM' });
    mySocket.emit('SetRoom', roomName);
  },
  addConvo: (conversation, participant) => async (dispatch) => {
    // console.log('addConvo', conversation, participant);
    dispatch({ type: 'API_CONVOS_ADD_CONVO' });
    mySocket.emit('NewConvo', { conversation, participant });
  },
  addMultiConvos: (roomName, conversations, assigned) => async (dispatch) => {
    // console.log('addMultiConvos', roomName, conversations, assigned);
    dispatch({ type: 'API_CONVOS_ADD_MULTI_CONVO' });
    mySocket.emit('NewMultiConvo', { roomName, conversations, assigned });
  },
  addParticipant: (conversation, participant) => async (dispatch) => {
    // console.log('addParticipant', conversation, participant);
    dispatch({ type: 'API_CONVOS_ADD_PARTICIPANT' });
    mySocket.emit('AddParticipant', { roomName: conversation.roomName, convoNumber: conversation.convoNumber, participant });
  },
  addHost: (roomName, participant, callBack) => async (dispatch) => {
    // console.log('addHost', roomName, participant, callBack);
    dispatch({ type: 'API_CONVOS_ADD_HOST' });
    mySocket.emit('AddHost', { roomName, participant }, (data) => {
      if (callBack) callBack();
    });
  },
  removeHost: (roomName, participant) => async (dispatch) => {
    // console.log('removeHost', roomName, participant);
    dispatch({ type: 'API_CONVOS_REMOVE_HOST' });
    mySocket.emit('RemoveHost', { roomName, participant });
  },
  updateProperty: (roomName, property, value) => async (dispatch) => {
    // console.log('updateProperty', roomName, property, value);
    dispatch({ type: 'API_CONVOS_UPDATE_PROPERTY' });

    mySocket.emit('UpdateRoomProperty', { roomName, property, value });
  },
  sendMessage: (roomName, to, message, action) => async (dispatch) => {
    // console.log('sendMessage', roomName, to, message, action);
    dispatch({ type: 'API_SEND_MESSAGE' });

    mySocket.emit('SendMessage', { roomName, to, message, action });
  },
  sendMessageToAll: (roomName, participants, message, action) => async (dispatch) => {
    // console.log('sendMessageToAll', roomName, participants, message, action);
    dispatch({ type: 'API_SEND_MESSAGE_ALL' });

    mySocket.emit('SendMessageToAll', { roomName, toAll: participants, message, action });
  }
};

export function reducer(state = initialState, action) {
  // console.log(action.type, action.payload);
  switch (action.type) {
    case API_CONVOS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload
      };
    case API_CONVOS_LOAD_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        room: action.room,
        lastRefreshed: (JSON.stringify(action.room) === JSON.stringify(state.room) ? Date.now() : state.lastRefreshed)
      };
    default:
      return state;
  }
}
