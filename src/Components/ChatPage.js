import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useHistory } from "react-router-dom";
import cookie from "js-cookie";
import axios from "../axios.js";
import { useStateValue } from "../context/provider";
import { userData } from "../context/actions";

function ChatPage() {
  const history = useHistory();
  const [, dispatch] = useStateValue();

  useEffect(() => {
    const callChatPage = async () => {
      const headers = {
        authorization: cookie.get("jwt"),
      };
      await axios
        .get("/auth/chatpage", {
          headers,
        })
        .then((res) => {
          dispatch(userData(res.data));
        })
        .catch((err) => {
          console.log(err);
          history.push("/");
        });
    };

    callChatPage();
  }, [history, dispatch]);

  return (
    <div className="app__body">
      <Sidebar />
      <Chat />
    </div>
  );
}

export default ChatPage;
