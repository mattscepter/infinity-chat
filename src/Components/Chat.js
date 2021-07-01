import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import ChatMessage from "./ChatMessage";
import ScrollableFeed from "react-scrollable-feed";
import axios from "../axios.js";
import { useStateValue } from "../context/provider";
import io from "socket.io-client";
import { Input, Button, Icon, Image } from "semantic-ui-react";
import infinity from "../infinity.png";
import infinitylogo from "../infinitylogo.svg";
import avatar from "../avatar.png";

function Chat() {
  const [state] = useStateValue();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [convo, setConvo] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  let i = 0;

  useEffect(() => {
    socket.current = io("https://infinity-chat.herokuapp.com");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  console.log(onlineUsers);

  useEffect(() => {
    socket.current.emit("addUser", state.user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [state.user._id]);

  useEffect(() => {
    try {
      arrivalMessage &&
        state.conversation?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    } catch (err) {}
  }, [arrivalMessage, state.conversation]);

  let convoId = null;
  try {
    convoId = state.conversation.members.find((m) => m !== state.user._id);
  } catch (err) {}

  useEffect(() => {
    const getUser = async () => {
      await axios
        .get(`/auth/user/${convoId}`)
        .then((res) => setConvo(res.data))
        .catch((err) => console.log(err));
    };
    getUser();
  }, [convoId]);

  useEffect(() => {
    const getMessages = async () => {
      await axios
        .get(`/messages/${state.conversation._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.log(err));
    };
    getMessages();
  }, [state.conversation]);

  const sendMessage = async () => {
    await axios
      .post("/messages", {
        conversationId: state.conversation._id,
        sender: state.user._id,
        text: input,
      })
      .then((res) => setMessages((prev) => [...prev, res.data]))
      .catch((err) => console.log(err));
    setInput("");

    await axios
      .patch(`/conversations/user/${state.conversation._id}`, {
        timestamp: new Date().toISOString(),
      })
      .catch((err) => console.log(err));

    socket.current.emit("sendMessage", {
      senderId: state.user._id,
      receiverId: convo.id,
      text: input,
    });
  };

  return (
    <div className="chat">
      {state.authStatus ? (
        <>
          <div className="chat__header">
            <div className="chat__headerLeft">
              <Image
                avatar
                src={
                  convo.imagePath
                    ? `https://infinity-chat.herokuapp.com/uploads/${convo.imagePath}`
                    : avatar
                }
                style={{ marginLeft: "20px", width: "55px", height: "55px" }}
              />

              <div className="chat__headerInfo">
                <h2>{convo.userName}</h2>
                <h4>{convo.name}</h4>
                {onlineUsers.find((m) => m.userId === convo.id) ? (
                  <li style={{ color: "green" }}>
                    <span style={{ position: "relative", left: "-10px" }}>
                      online
                    </span>
                  </li>
                ) : (
                  <p style={{ color: "gray" }}>offline</p>
                )}
              </div>
            </div>
            <img className="chat__headerRight" src={infinitylogo} alt="logo" />
          </div>
          <ScrollableFeed className="chat__body">
            {messages.map((message) => {
              return (
                <div key={i++}>
                  <ChatMessage mess={message} currentUser={state.user._id} />
                </div>
              );
            })}
          </ScrollableFeed>

          <div className="chat__footer">
            {/* <form>
              <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder="Type a message"
              />
              <IconButton onClick={sendMessage}>
                <SendRoundedIcon />
              </IconButton>
            </form> */}

            <Input
              // action={{
              //   icon: "search",
              //   onClick: () => {
              //     sendMessage();
              //   },
              // }}
              style={{ width: "100%" }}
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Type a message"
              size="big"
            >
              <Button
                color="green"
                animated
                style={{ width: "100px" }}
                onClick={sendMessage}
              >
                <Button.Content visible>Send</Button.Content>
                <Button.Content hidden>
                  <Icon name="send" />
                </Button.Content>
              </Button>
              <input />
            </Input>
          </div>
        </>
      ) : (
        <div className="empty__page">
          <h4>Select an old coversation or start a new</h4>
          <img src={infinity} alt="logo" />
        </div>
      )}
    </div>
  );
}

export default Chat;
