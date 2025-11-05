import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";
import Newsletter from "../../components/Newsletter";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {/* Newsletter Component - only show on desktop (non-mobile) */}
      {!mobile && <Newsletter />}
      
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <div key={profile.id} className="text-center">
                  <Link 
                    to={`/profiles/${profile.id}`}
                    className="text-decoration-none"
                  >
                    <Profile profile={profile} mobile showAvatarOnly />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

PopularProfiles.propTypes = {
  mobile: PropTypes.bool,
};

export default PopularProfiles;