import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";

const NavBar = () => {
  const { user } = useUser();
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
            {user?.publicMetadata?.role !== undefined && (
              <a href="/board">Board</a>
            )}
          </li>
        </ul>
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};

export default NavBar;
