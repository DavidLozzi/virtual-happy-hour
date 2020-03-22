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

export const name = 'conversations';

const initialState = {
  room: {},
  conversations: [],
  loading: true,
  error: false,
  errorMessage: ''
};

// TODO Need some level of error handling here

export const actions = {
  getFromApi: (roomName) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_LOAD_PENDING });
    mySocket.emit('SetRoom', roomName);
    mySocket.on('RoomDetails', room => {
      // mySocket.off('RoomDetails'); // TODO not sure i like this, but didn't want to bog down the reducer ever 500ms
      dispatch({ type: API_CONVERSATIONS_LOAD_SUCCESS, room })
    });
  },
  add: (conversation, participant) => async (dispatch, getState) => {
    dispatch({ type: API_CONVERSATIONS_ADD_PENDING });

    // const room = getState().state.room;
    const newConvo = Object.assign(conversation, { participants: [participant], hosts: [participant] });
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
        conversations: action.room.conversations
      };
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS:
    case API_CONVERSATIONS_ADD_SUCCESS:
    case API_CONVERSATIONS_PARTICIPANT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        conversations: action.conversations
      };
    default:
      return state;
  }
}
