import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar } from "@material-ui/core";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../context/provider";
import axios from "../axios.js";
import { authBool, conversation } from "../context/actions.js";
import cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { List, Button, Input, Form } from "semantic-ui-react";

function Sidebar() {
  const history = useHistory();
  const [state, dispatch] = useStateValue();
  const [convo, setConvo] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState({
    id: "",
    name: "",
    userName: "",
  });
  const [display, setDisplay] = useState("none");
  const [err, setErr] = useState({
    error: "",
    display: "",
  });

  const [newconvo, setNewConvo] = useState([]);

  const addConvo = async () => {
    await axios
      .post("/conversations", {
        senderId: state.user._id,
        receiverId: searchResult.id,
      })
      .then((res) => {
        setNewConvo(res.data);
        dispatch(conversation(res.data));
      })
      .catch((err) => {
        if (err.response.data.error === "Conversation already exists") {
          dispatch(conversation(err.response.data.c));
        }
      });

    setSearchResult({ id: "", name: "", userName: "" });
  };

  convo.sort(function (a, b) {
    var c = new Date(a.timestamp);
    var d = new Date(b.timestamp);
    return d - c;
  });

  useEffect(() => {
    const getConvo = async () => {
      await axios
        .get(`/conversations/${state.user._id}`)
        .then((res) => {
          setConvo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getConvo();
  }, [state.user._id, newconvo, convo]);

  const searchUser = async () => {
    await axios
      .post("/auth/user", { userName: search })
      .then((res) => {
        setSearchResult(res.data);
        setSearch("");
        setDisplay("flex");
      })
      .catch((err) => {
        if (err.response.data.error) {
          setErr({ error: err.response.data.error, display: "below" });
        } else {
          console.log(err);
        }
        setSearch("");
      });
  };

  const logout = () => {
    cookie.remove("jwt");
    dispatch(authBool(false));
    history.push("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__left">
          <Avatar />
          <h2>{state.user.userName}</h2>
        </div>
        <Button size="big" circular icon="sign-out" onClick={logout} />
      </div>
      <div className="sidebar__search">
        {/* <div className="sidebar__searchContainer">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            color="white"
            size="big"
            circular
            icon="search"
            onClick={searchUser}
            style={{ margin: "0" }}
          />
        </div> */}
        <Form.Field
          control={Input}
          error={{
            content: err.error,
            pointing: err.display,
          }}
          action={{
            icon: "search",
            color: "green",
            onClick: () => {
              setErr({ error: "", display: "" });
              searchUser();
            },
          }}
          style={{ width: "25vw" }}
          type="text"
          placeholder="Search or start new chat by entering username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div
          style={{ display: `${display}` }}
          className="sidebar__searchResult"
          onClick={() => {
            addConvo();
            dispatch(authBool(true));
            setDisplay("none");
          }}
        >
          <h2>{searchResult.userName}</h2>
        </div>
      </div>
      <div className="sidebar__chats">
        {convo.map((c) => {
          return (
            <List
              size="huge"
              animated
              selection
              verticalAlign="middle"
              key={c._id}
            >
              <SidebarChat
                conversations={c}
                currentUser={state.user}
                setErr={setErr}
              />
            </List>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
