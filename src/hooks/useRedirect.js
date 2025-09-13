import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const refresh_roken = localStorage.getItem('refresh_token');
        if (!refresh_roken) {
          throw new Error('No "refresh_token" found');
        }
        const {data} = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refresh_roken });
        localStorage.setItem('access_token', data.access);
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};