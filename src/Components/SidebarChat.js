import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Image, List } from "semantic-ui-react";
import axios from "../axios.js";
import { useStateValue } from "../context/provider";
import { authBool, conversation } from "../context/actions.js";
import avatar from "../avatar.png";

function SidebarChat({ conversations, currentUser, setErr }) {
  const [convo, setConvo] = useState([]);
  const [, dispatch] = useStateValue();

  const convoId = conversations.members.find((m) => m !== currentUser._id);

  useEffect(() => {
    const getUser = async () => {
      await axios
        .get(`/auth/user/${convoId}`)
        .then((res) => setConvo(res.data))
        .catch((err) => console.log(err));
    };
    getUser();
  }, [convoId]);

  return (
    <List.Item
      className="sidebarChat"
      onClick={() => {
        dispatch(conversation(conversations));
        dispatch(authBool(true));
        setErr({ error: "", display: "" });
      }}
    >
      <profileImg></profileImg>
      <Image
        className="avatar"
        avatar
        src={
          convo.imagePath
            ? `https://infinity-chat.herokuapp.com/uploads/${convo.imagePath}`
            : avatar
        }
        style={{ marginLeft: "20px", width: "50px", height: "50px" }}
      />
      <List.Content style={{ margin: "10px" }}>
        <List.Header>
          <h2>{convo.userName}</h2>
        </List.Header>
        <List.Description>
          <p>{convo.name}</p>
        </List.Description>
      </List.Content>
    </List.Item>
  );
}

export default SidebarChat;
