import React from "react";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl" href="/">
          StockChecker
        </a>
      </div>
      <div className="navbar-center hidden lg:flex"></div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/board">Board</a>
          </li>
        </ul>
        <a className="btn">Login</a>
      </div>
    </div>
  );
};

export default NavBar;
