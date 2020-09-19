import React from "react";

const Header = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      AMC Project
      {user && (
        <span>
          <h1>{user.name}</h1>
        </span>
      )}
    </nav>
  );
};

export default Header;
