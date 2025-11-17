import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  const { profile, mobile, imageSize = 55, showFollowButton = true } = props;
  const { id, following_id, image, owner } = profile;
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  const handleFollowClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await handleFollow(profile);
    } catch (error) {
      // Console error removed for production
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollowClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await handleUnfollow(profile);
    } catch (error) {
      // Console error removed for production
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <Link to={`/profiles/${id}`} className="text-decoration-none">
          <strong>{owner}</strong>
        </Link>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {showFollowButton &&
          !mobile &&
          currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={handleUnfollowClick}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Unfollow"}
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={handleFollowClick}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Follow"}
            </Button>
          ))}
      </div>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    following_id: PropTypes.number,
    image: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
  mobile: PropTypes.bool,
  imageSize: PropTypes.number,
  showFollowButton: PropTypes.bool,
};

export default Profile;