import mySocket from 'components/sockets/mySocket';
import Room from '../../../components/room/room';

const ME_SET_SUCCESS = 'ME_SET_SUCCESS';
const ME_PRIMARY_CONVO = 'ME_PRIMARY_CONVO';
const API_CONVOS_LOAD_ROOM_SUCCESS = 'API_CONVOS_LOAD_ROOM_SUCCESS';

export const name = 'me';

const initialState = {
  participant: {
    name: '',
    email: '',
    id: '',
    primaryConvoNumber: 0
  }
};

export const actions = {
  set: (myname, email) => async (dispatch) => {
    dispatch({ type: ME_SET_SUCCESS, participant: { name: myname, email, id: mySocket.id } });
  },
  setPrimaryConvoNumber: (convoNumber = 0) => (dispatch) => {
    dispatch({ type: ME_PRIMARY_CONVO, convoNumber});
  }
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_CONVOS_LOAD_ROOM_SUCCESS:
      return {
        ...state,
        participant: {
          ...state.participant,
          primaryConvoNumber: action.room.participants.some(p => p.email === state.participant.email)
            ? action.room.participants.find(p => p.email === state.participant.email).primaryConvoNumber
            : 0
        }
      }
    case ME_SET_SUCCESS:
      return {
        ...state,
        participant: {
          ...action.participant,
          primaryConvoNumber: state.participant.primaryConvoNumber
        }
      };
    case ME_PRIMARY_CONVO:
      return {
        ...state,
        participant: {
          ...state.participant,
          primaryConvoNumber: action.convoNumber
        }
      };
    default:
      return state;
  }
}
