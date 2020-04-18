import mySocket from 'components/sockets/mySocket';

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
    debugger;
    mySocket.on('RoomDetails', room => { // room is an object with convos
      debugger;
      dispatch({ type: API_CONVOS_LOAD_ROOM_SUCCESS, room })
    });
    mySocket.on('error', (error) => { // TODO alert users
      console.log('socket error', error);
      dispatch({ type: API_CONVOS_ERROR, error })
    });
  },
  setRoom: (roomName) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_SET_ROOM' });
    debugger;
    mySocket.emit('SetRoom', roomName);
  },
  add: (conversation, participant, host) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_ADD_CONVO' });

    const newConvo = Object.assign(conversation, { participants: [participant], hosts: [host] });
    mySocket.emit('NewConvo', newConvo);
  },
  addParticipant: (conversation, participant) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_ADD_PARTICIPANT' });

    mySocket.emit('AddParticipant', { roomName: conversation.roomName, convoNumber: conversation.convoNumber, participant });
  },
  removeMeFromOtherConvos: (conversation, participant) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_REMOVE_FROM_OTHER' });

    mySocket.emit('RemoveFromOtherConvos', { roomName: conversation.roomName, convoNumber: conversation.convoNumber, participant })
  },
  removeMeFromThisConvo: (conversation, participant) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_REMOVE_FROM_CONVO' });

    mySocket.emit('RemoveMeFromThisConvo', { roomName: conversation.roomName, convoNumber: conversation.convoNumber, participant });
  },
  updateProperty: (roomName, property, value) => async (dispatch) => {
    dispatch({ type: 'API_CONVOS_UPDATE_PROPERTY' });

    mySocket.emit('UpdateRoomProperty', { roomName, property, value });
  }
};

export function reducer(state = initialState, action) {
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
