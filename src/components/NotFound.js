import React from "react";
import styles from "../styles/NotFound.module.css";
import Asset from "./Asset";

const NotFound = () => {
  return (
    <div className={styles.NotFound}>
      <div className={styles.content}>
        <h1 className={styles.title}>404 Not Found</h1>
        <Asset
          message={`Sorry, the page you're looking for doesn't exist`}
        />
      </div>
    </div>
  );
};

export default NotFound;