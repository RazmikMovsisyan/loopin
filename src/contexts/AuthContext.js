import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ PropTypes für children
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
