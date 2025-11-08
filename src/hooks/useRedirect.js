import { useEffect } from "react";
import { useHistory } from "react-router";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = () => {
      if (userAuthStatus === "loggedIn" && currentUser) {
        history.push("/");
      } else if (userAuthStatus === "loggedOut" && !currentUser) {
        history.push("/signin");
      }
    };

    handleMount();
  }, [history, userAuthStatus, currentUser]);
};