import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed_profile: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));

    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      // CRITICAL FIX: Prüfe ob following_id existiert
      if (!clickedProfile.following_id) {
        console.error("No following_id found for profile:", clickedProfile);
        return;
      }

      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));

    } catch (err) {
      console.error("Unfollow error:", err);
      // Falls 404, aktualisiere die Daten um inkonsistente States zu bereinigen
      if (err.response?.status === 404) {
        const handleMount = async () => {
          try {
            const { data } = await axiosReq.get("/profiles/?ordering=-followers_count");
            setProfileData((prevState) => ({
              ...prevState,
              popularProfiles: data,
            }));
          } catch (refreshErr) {
            console.error("Refresh error:", refreshErr);
          }
        };
        handleMount();
      }
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/profiles/?ordering=-followers_count");
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.error("Error loading popular profiles:", err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

ProfileDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};