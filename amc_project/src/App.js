import React, { Component } from "react";
import * as jwt_decode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";

import Question from "./components/Question";
import Header from "./components/Header";
import Login from "./components/Login";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {};

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
  }
  render() {
    return (
      <div>
        <ToastContainer />
        <Header user={this.state.user} />
        <Switch>
          <Route path="/quiz" component={Question} />
          <Route path="/" exact component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;
