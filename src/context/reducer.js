export const initialState = {
  user: [],
  conversation: [],
  authStatus: false,
};

export const AUTH_DATA = "AUTH_DATA";
export const CONVO = "CONVO";
export const AUTH_STATUS = "AUTH_STATUS";

export const reducer = (state, action) => {
  switch (action.type) {
    case AUTH_DATA:
      return {
        ...state,
        user: action.payload,
      };
    case CONVO:
      return {
        ...state,
        conversation: action.payload,
      };
    case AUTH_STATUS:
      return {
        ...state,
        authStatus: action.payload,
      };
    default:
      return state;
  }
};
