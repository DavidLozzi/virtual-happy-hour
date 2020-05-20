import mySocket from 'components/sockets/mySocket';

const ME_SET_SUCCESS = 'ME_SET_SUCCESS';
const ME_PRIMARY_CONVO = 'ME_PRIMARY_CONVO';

export const name = 'me';

const initialState = {
  participant: {
    name: '',
    email: '',
    id: ''
  },
  primaryConvoNumber: 0
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
    case ME_SET_SUCCESS:
      return {
        ...state,
        participant: action.participant
      };
    case ME_PRIMARY_CONVO:
      return {
        ...state,
        primaryConvoNumber: action.convoNumber
      };
    default:
      return state;
  }
}
