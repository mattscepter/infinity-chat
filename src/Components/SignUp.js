import React, { useState } from "react";
import "./SignUp.css";
import axios from "../axios.js";
import { useHistory } from "react-router-dom";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import infinity from "../infinity.png";
import Compressor from "compressorjs";

function SignUp() {
  const history = useHistory();
  const [err, setErr] = useState("");
  const [img, setImg] = useState({
    file: null,
  });
  const [user, setUSer] = useState({
    name: "",
    email: "",
    userName: "",
    password: "",
    cpassword: "",
  });

  const handleCompressedUpload = (e) => {
    const image = e.target.files[0];
    new Compressor(image, {
      quality: 0.5,
      maxWidth: 2000,
      success: (compressedResult) => {
        setImg(compressedResult);
      },
    });
  };
  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUSer({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, userName, password, cpassword } = user;
    let imageFormObj = new FormData();

    imageFormObj.append("imageName", "multer-image-" + Date.now());
    imageFormObj.append("imageData", img);
    imageFormObj.append("name", name);
    imageFormObj.append("email", email);
    imageFormObj.append("userName", userName);
    imageFormObj.append("password", password);
    imageFormObj.append("cpassword", cpassword);

    console.log(...imageFormObj);

    await axios
      .post("/auth/register", imageFormObj)
      .then((res) => {
        console.log("successful" + res);
        history.push("/");
        setErr("");
      })
      .catch((err) => {
        if (err.response.data.error) {
          setErr(err.response.data.error);
          if (err.response.data.error === "Email already Exists") {
            setUSer({
              ...user,
              email: "",
            });
          } else if (err.response.data.error === "Username already Exists") {
            setUSer({
              ...user,
              userName: "",
            });
          } else if (err.response.data.error === "Passwords not same") {
            setUSer({
              ...user,
              password: "",
              cpassword: "",
            });
          }
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div className="signIn">
      <div className="login__containerLeft">
        <img src={infinity} alt="logo" />
      </div>
      <div className="login__containerRight">
        <div className="login__container">
          <Form error className="login__form" size="large">
            <Form.Field>
              <input
                type="text"
                placeholder="Enter Name"
                onChange={handleInput}
                name="name"
                value={user.name}
              />
            </Form.Field>
            <Form.Field>
              <input
                type="text"
                placeholder="Enter Email"
                onChange={handleInput}
                name="email"
                value={user.email}
              />
            </Form.Field>
            <Form.Field>
              <input
                type="text"
                placeholder="Enter Username"
                onChange={handleInput}
                name="userName"
                value={user.userName}
              />
            </Form.Field>
            <Form.Field>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={handleInput}
                name="password"
                value={user.password}
              />
            </Form.Field>
            <Form.Field>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={handleInput}
                name="cpassword"
                value={user.cpassword}
              />
            </Form.Field>
            <Form.Field>
              <input type="file" onChange={(e) => handleCompressedUpload(e)} />
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
              <Button color="green" onClick={PostData} animated size="big">
                <Button.Content visible>Sign Up</Button.Content>
                <Button.Content hidden>
                  <Icon name="signup" />
                </Button.Content>
              </Button>
            </Form.Field>
            <Form.Field>
              <Button
                color="green"
                onClick={() => {
                  history.push("/");
                }}
                animated
              >
                <Button.Content visible>Sign In</Button.Content>
                <Button.Content hidden>
                  <Icon name="sign-in" />
                </Button.Content>
              </Button>
            </Form.Field>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
