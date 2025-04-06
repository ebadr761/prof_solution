import React, { useContext } from "react";
import { AuthContext } from "./LoginForm";
import DisplayStatus from "./DisplayStatus";

const AuthMessage = () => {
  const { authStatus } = useContext(AuthContext);
  if (authStatus.message) {
    return <DisplayStatus type={authStatus.type} message={authStatus.message} />;
  } else {
    return null;
  }
};

export default AuthMessage;