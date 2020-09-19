import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="login-form">
      <label htmlFor={name}>{label} </label>
      <input
        {...rest}
        name={name}
        id={name}
        className="form-control input-lg"
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};
export default Input;
