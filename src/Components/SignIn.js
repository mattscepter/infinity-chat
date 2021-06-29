import React, { useState } from "react";
import "./SignIn.css";
import axios from "../axios.js";
import cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import infinity from "../infinity.png";

function SignIn() {
  const history = useHistory();
  const [err, setErr] = useState("");

  const [user, setUSer] = useState({
    userName: "",
    password: "",
  });

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUSer({ ...user, [name]: value });
  };

  // useEffect(() => {
  //   const callChatPage = async () => {
  //     const headers = {
  //       authorization: cookie.get("jwt"),
  //     };
  //     await axios
  //       .get("/auth/chatpage", {
  //         headers,
  //       })
  //       .then((res) => {
  //         history.push("/chat");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   callChatPage();
  // }, [history]);

  const Login = async (e) => {
    e.preventDefault();
    await axios
      .post("/auth/signin", user)
      .then((res) => {
        if (res.data.token) {
          cookie.set("jwt", res.data.token, { expires: 1 });
        }
        history.push("/chat");
        setErr("");
      })
      .catch((err) => {
        if (err.response.data.error) {
          setErr(err.response.data.error);
        }
        setUSer({
          ...user,
          userName: "",
          password: "",
        });
      });
  };

  console.log(err);

  return (
    <div className="signIn">
      <div className="login__containerLeft">
        <img src={infinity} alt="logo" />
      </div>
      <div className="login__containerRight">
        <div className="login__container">
          <Form error className="login__form" size="big">
            <Form.Field width={15}>
              <input
                type="text"
                placeholder="Enter Username"
                name="userName"
                value={user.userName}
                onChange={handleInput}
              />
            </Form.Field>
            <Form.Field width={15}>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={user.password}
                onChange={handleInput}
              />
            </Form.Field>
            {err === "" ? (
              <></>
            ) : (
              <Message
                style={{ width: "15vw", fontSize: "15px" }}
                error
                header={err}
              />
            )}
            <Form.Field>
              <Button
                onClick={Login}
                animated
                color="green"
                width={10}
                size="big"
              >
                <Button.Content visible>Sign In</Button.Content>
                <Button.Content hidden>
                  <Icon name="sign-in" />
                </Button.Content>
              </Button>
            </Form.Field>
            <Form.Field>
              <Button
                color="green"
                onClick={() => history.push("/signup")}
                animated
              >
                <Button.Content visible>Sign Up</Button.Content>
                <Button.Content hidden>
                  <Icon name="signup" />
                </Button.Content>
              </Button>
            </Form.Field>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
