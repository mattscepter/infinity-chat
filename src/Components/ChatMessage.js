import React from "react";
import "./ChatMessage.css";

function ChatMessage({ mess, currentUser }) {
  const time = new Date(mess.createdAt).toLocaleString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "short",
  });
  return (
    <div
      className={`chat__message ${
        mess.sender !== currentUser ? "sender" : "reciever"
      }`}
    >
      <p style={{ margin: "0", paddingBottom: "10px" }}>{mess.text}</p>
      <p style={{ fontSize: "10px", margin: "0" }}>{time}</p>
    </div>
  );
}

export default ChatMessage;
