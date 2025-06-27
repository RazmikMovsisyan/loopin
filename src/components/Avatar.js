import React from "react";
import { Image } from "react-bootstrap";

const fallbackImage =
  "https://res.cloudinary.com/dj5p9ubcu/image/upload/v1750632467/default_profile_rxsxdv.jpg";

const Avatar = ({ src, alt = "avatar", height = 40, text = "", className = "" }) => {
  const isFallback =
    !src || src.includes("default_profile_rxsxdv") || src.startsWith("../");

  const imageSrc = isFallback ? fallbackImage : src;

  return (
    <span className="align-items-center">
      <Image
        src={imageSrc}
        alt={alt}
        height={height}
        width={height}
        roundedCircle
        className={`me-1 ${className}`}
      />
      {text && <strong>{text}</strong>}
    </span>
  );
};

export default Avatar;
