import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDrafts } from "../../contexts/DraftsContext";
import Draft from "./Draft";
import styles from "../../styles/DraftsPage.module.css";

const DraftsPage = () => {
  const { drafts, hasLoaded, refreshDrafts } = useDrafts();

  useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts]);

  return (
    <Container className={styles.Container}>
      <h1>My Drafts</h1>
      {hasLoaded ? (
        drafts.results.length ? (
          drafts.results.map((draft) => (
            <Draft key={draft.id} draft={draft} />
          ))
        ) : (
          <p>No Draft entries.</p>
        )
      ) : (
        <p>Loading drafts...</p>
      )}
    </Container>
  );
};

export default DraftsPage;