import React from "react";
import styles from "../../styles/Draft.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom";
import { deleteDraft, publishDraft } from "../../api/axiosDrafts";

const Draft = ({ draft, setDrafts }) => {
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === draft.author;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/drafts/${draft.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteDraft(draft.id);
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        results: prevDrafts.results.filter((d) => d.id !== draft.id),
      }));
    } catch (err) {
      // Error handling
    }
  };

  const handlePublish = async () => {
    try {
      await publishDraft(draft.id);
      history.push("/");
    } catch (err) {
      // Error handling
    }
  };

  return (
    <div className={styles.Draft}>
      <p>{draft.content}</p>
      {draft.image && (
        <div>
          <img src={draft.image} alt="Draft" />
        </div>
      )}
      <div className={styles.DraftMeta}>
        <span>Status: {draft.status}</span>
        <span>Erstellt: {new Date(draft.created_at).toLocaleDateString()}</span>
      </div>
      {is_owner && (
        <MoreDropdown
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePublish={handlePublish}
        />
      )}
    </div>
  );
};

export default Draft;