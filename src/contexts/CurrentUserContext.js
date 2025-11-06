import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory, useLocation } from "react-router-dom";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  const location = useLocation();

  const handleMount = useCallback(async () => {
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
      return
    }

    if (location.pathname === "/") {
      return;
    }

    try {  
      const { data: userData } = await axiosRes.get("dj-rest-auth/user/", 
        {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }
      );
      
      try {
        const { data: profileData } = await axiosReq.get(
          `/profiles/${userData.profile_id}/`
        );
        
        setCurrentUser({
          ...userData,
          profile: profileData,    
          profile_image: profileData.image,
          image: profileData.image
        });
      } catch (profileErr) {
        console.log("Profile loading failed, using basic user data:", profileErr);
        setCurrentUser({
          ...userData,
          profile: null,
          profile_image: null,
          image: null
        });
      }
    } catch (err) {   
      setCurrentUser(null);
      if (axios.isAxiosError(err)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (location.pathname !== "/") {
          history.push("/");
        }
      }
    }
  }, [history, location.pathname]);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (location.pathname !== "/" && shouldRefreshToken()) {
          try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) {
              throw new Error('No "refresh_token" found');
            }
            const {data} = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refresh_token });
            localStorage.setItem('access_token', data.access);
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                if (location.pathname !== "/") {
                  history.push("/signin");
                }
              }
              return null;
            });
            removeTokenTimestamp();
            return config;
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 && location.pathname !== "/") {
          try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) {
              throw new Error('No "refresh_token" found');
            }
            const {data} = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refresh_token });
            localStorage.setItem('access_token', data.access);
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                if (location.pathname !== "/") {
                  history.push("/signin");
                }
              }
              return null;
            });
            removeTokenTimestamp();
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history, location.pathname]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};