import React from "react";

function Choice(props) {
  return (
    <React.Fragment>
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio1"
          name="customRadio"
          class="custom-control-input"
        />
        <label class="custom-control-label" for="customRadio1">
          Toggle this custom radio
        </label>
      </div>
    </React.Fragment>
  );
}

export default Choice;
