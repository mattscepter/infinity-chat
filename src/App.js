import "./App.css";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import ChatPage from "./Components/ChatPage";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <div className="app__body app__signIn">
            <SignIn />
          </div>
        </Route>
        <Route path="/signup">
          <div className="app__body app__signIn">
            <SignUp />
          </div>
        </Route>
        <Route path="/chat">
          <ChatPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
