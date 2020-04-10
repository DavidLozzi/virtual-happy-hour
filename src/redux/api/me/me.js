export const API_ME_SET_PENDING = 'API_ME_SET_PENDING';
export const API_ME_SET_SUCCESS = 'API_ME_SET_SUCCESS';
export const API_ME_SET_FAILED = 'API_ME_SET_FAILED';

export const name = 'me';

const initialState = {
  participant: {},
  loading: true,
  error: false,
  errorMessage: ''
};

export const actions = {
  set: (myname, email) => async (dispatch) => {
    dispatch({ type: API_ME_SET_PENDING });

    dispatch({ type: API_ME_SET_SUCCESS, participant: { name: myname, email } });
  }
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_ME_SET_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: ''
      };
    case API_ME_SET_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload
      };
    case API_ME_SET_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        participant: action.participant
      };
    default:
      return state;
  }
}
