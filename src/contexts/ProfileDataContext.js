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

  const refreshProfileData = async () => {
    try {
      const { data: popularData } = await axiosReq.get(
        "/profiles/?ordering=-followers_count"
      );
      
      if (profileData.pageProfile.results.length > 0) {
        const currentProfileId = profileData.pageProfile.results[0].id;
        const { data: pageData } = await axiosReq.get(`/profiles/${currentProfileId}/`);
        
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageData] },
          popularProfiles: popularData,
        }));
      } else {
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: popularData,
        }));
      }
    } catch (err) {
      console.log("Error refreshing profile data:", err);
    }
  };

  const handleFollow = async (clickedProfile) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const { data } = await axiosRes.post(
        "/followers/",
        {
          followed_profile: clickedProfile.id,
        },
        {
          headers: {
            'Authorization': `Bearer ${access_token}`      
          }
        }
      );

      // Sofortiges UI-Update
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

      setTimeout(() => {
        refreshProfileData();
      }, 500);

    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
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

      setTimeout(() => {
        refreshProfileData();
      }, 500);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow, refreshProfileData }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

ProfileDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};