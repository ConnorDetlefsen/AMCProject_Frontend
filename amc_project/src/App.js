import React, { Component } from "react";
// import * as jwt_decode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";

import Question from "./components/Question";
import Login from "./components/Login";

import { UserContext } from "./Context/UserContext";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    currentUser: {
      username: null,
      ID: null,
      CurrentQuestion: null,
    },
  };
  /*
  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token"); //this is not a jwt it is django token
      console.log(jwt);
      const user = jwt_decode(jwt);
      console.log(user);
      //this.setState({ user });
      //console.log(jwt);
    } catch (ex) {
      console.log(ex, ex.stack);
    }
  } */
  render() {
    return (
      <div>
        <UserContext.Provider
          value={{
            currentUser: this.state.currentUser,
            onLoggedIn: this.handleLoggedIn,
          }}
        >
          <body>
            <ToastContainer />
            <Switch>
              <Route path="/quiz" component={Question} />
              <Route path="/" exact component={Login} />
            </Switch>
          </body>
        </UserContext.Provider>
      </div>
    );
  }
}

export default App;
