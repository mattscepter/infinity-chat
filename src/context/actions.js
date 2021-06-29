import { AUTH_DATA, CONVO, AUTH_STATUS } from "./reducer";

export const userData = (data) => ({
  type: AUTH_DATA,
  payload: data,
});

const conversation = (data) => ({
  type: CONVO,
  payload: data,
});

const authBool = (data) => ({
  type: AUTH_STATUS,
  payload: data,
});

export { conversation, authBool };
