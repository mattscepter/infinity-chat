import axios from "axios";

const instance = axios.create({
  baseURL: "https://infinity-chat.herokuapp.com",
});

export default instance;
