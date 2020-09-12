import React from "react";

function AnswerChoice(props) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={props.handleClick}
    >
      {props.label}
    </button>
  );
}

export default AnswerChoice;
