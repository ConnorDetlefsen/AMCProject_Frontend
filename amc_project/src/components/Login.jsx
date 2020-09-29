import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../Context/UserContext";

class Login extends Component {
  static contextType = UserContext;

  state = {
    account: { username: "", password: "" },
    errors: {},
    userList: {},
  };

  schema = {
    username: Joi.string().required().label("username"),
    password: Joi.string().required().label("password"),
  };

  async componentDidMount() {
    http.get(config.apiEndpoint + "/users/").then((res) => {
      console.log(res.data);
      this.setState({ userList: res.data });
    });
  }

  //used in do submit to send successfully logged in user to quiz
  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.account, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account, errors });
  };
  /* token do submit 
  doSubmit = async () => {
    try {
      const { account } = this.state;
      const { data } = await login(account.username, account.password);
      localStorage.setItem("token", data.token);
      //this.props.history.push("/quiz");
      window.location = "/quiz";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.account;
        this.setState({ errors });
      }
    }
  }; */

  // do submit from bas
  doSubmit = async () => {
    const { userList, account } = this.state;
    const { history } = this.props;

    for (let x in userList) {
      if (
        account.username === userList[x].username &&
        account.password === userList[x].password
      ) {
        this.context.currentUser.username = userList[x].username;
        this.context.currentUser.ID = userList[x].id;
        this.context.currentUser.CurrentQuestion = userList[x].currentQuestion;

        //tracks user log in
        http
          .post(config.apiEndpoint + "/logintracking/", {
            user_id: userList[x].id,
          })
          .then((res) => {
            console.log(res);
          });

        toast.success(`Logged in successfully!`);

        await this.sleep(2000);

        history.push("/quiz");
      } else {
        toast.error("Username and Password doesn't match");
      }
    }
  };

  render() {
    const { account, errors } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />

        <div className="login-body">
          <div className="login-page ">
            <div className="login-css">
              <div className="login-form">
                <div className="login">
                  <div className="Login Header">
                    <h1>
                      <b>AMC User Login</b>
                    </h1>
                  </div>
                </div>
                <form className="login-form " onSubmit={this.handleSubmit}>
                  <Input
                    className="login-input"
                    name="username"
                    value={account.username}
                    label="Username"
                    onChange={this.handleChange}
                    error={errors.username}
                  />
                  <Input
                    className="login-input"
                    name="password"
                    value={account.password}
                    label="Password"
                    onChange={this.handleChange}
                    error={errors.password}
                  />
                  <button
                    disabled={this.validate()}
                    className="btn btn-primary login-button"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
