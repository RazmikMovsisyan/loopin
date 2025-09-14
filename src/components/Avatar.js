import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 45, text }) => {
  const defaultImage = "https://res.cloudinary.com/dj5p9ubcu/image/upload/v1750632467/default_profile_rxsxdv.jpg";
  
  const getAvatarSrc = () => {
    if (!src) return defaultImage;
    if (src.includes("default_profile_rxsxdv")) return defaultImage;
    if (src.startsWith("../")) return defaultImage;
    if (src.startsWith("http")) return src;
    return `${process.env.REACT_APP_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/dj5p9ubcu/image/upload/'}${src}`;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <span>
      <img
        className={styles.Avatar}
        src={avatarSrc}
        height={height}
        width={height}
        alt="avatar"
        onError={(e) => {
          e.target.src = defaultImage;
        }}
      />
      {text}
    </span>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  height: PropTypes.number,
  text: PropTypes.string,
};

export default Avatar;