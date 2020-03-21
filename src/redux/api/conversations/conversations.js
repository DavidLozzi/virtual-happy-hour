import store from 'redux/store';

export const API_CONVERSATIONS_ADD_PENDING = 'API_CONVERSATIONS_ADD_PENDING';
export const API_CONVERSATIONS_ADD_SUCCESS = 'API_CONVERSATIONS_ADD_SUCCESS';
export const API_CONVERSATIONS_ADD_FAILED = 'API_CONVERSATIONS_ADD_FAILED';
export const API_CONVERSATIONS_PARTICIPANT_PENDING = 'API_CONVERSATIONS_PARTICIPANT_PENDING';
export const API_CONVERSATIONS_PARTICIPANT_SUCCESS = 'API_CONVERSATIONS_PARTICIPANT_SUCCESS';
export const API_CONVERSATIONS_PARTICIPANT_FAILED = 'API_CONVERSATIONS_PARTICIPANT_FAILED';
export const API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING = 'API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING';
export const API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS = 'API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS';
export const API_CONVERSATIONS_DELETE_FAILED = 'API_CONVERSATIONS_DELETE_FAILED';

export const name = 'conversations';

const initialState = {
  theRoom: {},
  conversations: [],
  loading: true,
  error: false,
  errorMessage: ''
};

export const actions = {
  add: (conversation, participant) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_ADD_PENDING });

    dispatch({ type: API_CONVERSATIONS_ADD_SUCCESS, conversation, participant });
  },
  addParticipant: (conversation, participant) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_PENDING });

    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_SUCCESS, conversation, participant });
  },
  removeParticipant: (conversation, participant) => async (dispatch) => {
    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING });

    dispatch({ type: API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS, conversation, participant });
  }
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_PENDING:
    case API_CONVERSATIONS_PARTICIPANT_PENDING:
    case API_CONVERSATIONS_ADD_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: ''
      };
    case API_CONVERSATIONS_DELETE_FAILED:
    case API_CONVERSATIONS_PARTICIPANT_FAILED:
    case API_CONVERSATIONS_ADD_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload
      };
    case API_CONVERSATIONS_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        conversations: [
          ...state.conversations,
          {
            ...action.conversation,
            participants: [
              ...action.conversation.participants,
              action.participant
            ]
          }
        ]
      };
    case API_CONVERSATIONS_PARTICIPANT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        conversations: state.conversations.map(convo => {
          if (convo.roomName === action.conversation.roomName) {
            const newConvo = {...convo};
            newConvo.participants.push(action.participant)
            return newConvo;
          }
          return convo;
        })
      };
    case API_CONVERSATIONS_PARTICIPANT_REMOVE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        conversations: state.conversations.map(convo => {
          if (convo.roomName === action.conversation.roomName) {
            const newConvo = {...convo};
            newConvo.participants = newConvo.participants.map(p => p !== action.participant ? p : null)
            return newConvo;
          }
          return convo;
        })
      };
    default:
      return state;
  }
}
