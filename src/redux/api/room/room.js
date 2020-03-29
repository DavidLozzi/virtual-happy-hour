import mySocket from 'components/sockets/mySocket';

export const API_CONVERSATIONS_LOAD_PENDING = 'API_CONVERSATIONS_LOAD_PENDING';
export const API_CONVERSATIONS_LOAD_SUCCESS = 'API_CONVERSATIONS_LOAD_SUCCESS';
export const API_CONVERSATIONS_LOAD_FAILED = 'API_CONVERSATIONS_LOAD_FAILED';
export const API_CONVERSATIONS_ADD_PENDING = 'API_CONVERSATIONS_ADD_PENDING';
export const API_CONVERSATIONS_ADD_SUCCESS = 'API_CONVERSATIONS_ADD_SUCCESS';
export const API_CONVERSATIONS_ADD_FAILED = 'API_CONVERSATIONS_ADD_FAILED';
export const API_CONVERSATIONS_PARTICIPANT_PENDING = 'API_CONVERSATIONS_PARTICIPANT_PENDING';
export const API_CONVERSATIONS_PARTICIPANT_SUCCESS = 'API_CONVERSATIONS_PARTICIPANT_SUCCESS';
export const API_CONVERSATIONS_PARTICIPANT_FAILED = 'API_CONVERSATIONS_PARTICIPANT_FAILED';
export const API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING = 'API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING';
export const API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS = 'API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS';
export const API_CONVERSATIONS_PARTICIPANT_REMOVE_FAILED = 'API_CONVERSATIONS_PARTICIPANT_REMOVE_FAILED';

export const name = 'room';

const initialState = {
  room: {},
  conversations: [],
  loading: true,
  error: false,
  errorMessage: '',
  lastRefreshed: Date.now()
};

// TODO Need some level of error handling here

export const actions = {
  getFromApi: (roomName) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_LOAD_PENDING });
    mySocket.emit('SetRoom', roomName, (room) => {
      dispatch({ type: API_CONVERSATIONS_LOAD_SUCCESS, room })
    });
  },
  listen: () => async (dispatch) => {
    console.log('socket listening on RoomDetails');
    mySocket.on('RoomDetails', room => {
      dispatch({ type: API_CONVERSATIONS_LOAD_SUCCESS, room })
    });
  },
  saveRoom: (room) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_LOAD_SUCCESS, room});
  },
  add: (conversation, participant, host) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_ADD_PENDING });

    const newConvo = Object.assign(conversation, { participants: [participant], hosts: [host] });
    mySocket.emit('NewConvo', newConvo, (conversations) => {
      dispatch({ type: API_CONVERSATIONS_ADD_SUCCESS, conversations });
    });
  },
  addParticipant: (conversation, participant) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_PENDING });

    mySocket.emit('AddParticipant', { roomName: conversation.roomName, participant }, (conversations) => {
      dispatch({ type: API_CONVERSATIONS_PARTICIPANT_SUCCESS, conversations });
    });
  },
  removeMeFromOtherConvos: (conversation, participant) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING });

    mySocket.emit('RemoveFromOtherConvos', { roomName: conversation.roomName, participant }, (conversations) => {
      dispatch({ type: API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS, conversations });
    })
  }
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_CONVERSATIONS_LOAD_PENDING:
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING:
    case API_CONVERSATIONS_PARTICIPANT_PENDING:
    case API_CONVERSATIONS_ADD_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: ''
      };
    case API_CONVERSATIONS_LOAD_FAILED:
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_FAILED:
    case API_CONVERSATIONS_PARTICIPANT_FAILED:
    case API_CONVERSATIONS_ADD_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload
      };
    case API_CONVERSATIONS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        room: action.room,
        conversations: action.room.conversations,
        lastRefreshed: (JSON.stringify(action.room) === JSON.stringify(state.room) ? Date.now() : state.lastRefreshed)
      };
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS:
    case API_CONVERSATIONS_ADD_SUCCESS:
    case API_CONVERSATIONS_PARTICIPANT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        conversations: action.conversations,
        lastRefreshed: (JSON.stringify(action.room) === JSON.stringify(state.room) ? Date.now() : state.lastRefreshed)
      };
    default:
      return state;
  }
}
