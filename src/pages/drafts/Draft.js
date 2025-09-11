import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Draft.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom";
import { deleteDraft, publishDraft } from "../../api/axiosDrafts";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

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
      console.error("Error deleting draft:", err);
    }
  };

  const handlePublish = async () => {
    try {
      await publishDraft(draft.id);
      
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        results: prevDrafts.results.filter((d) => d.id !== draft.id),
      }));
      
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (err) {
      console.error("Error publishing draft:", err);
      alert("Failed to publish draft. Please try again.");
    }
  };
  
  return (
    <Card className={styles.Draft}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${draft.author_profile_id}`}>
            <Avatar src={draft.author_profile_image} height={55} />
            {draft.author}
          </Link>
          <div className="d-flex align-items-center">
            <span>{new Date(draft.updated_at).toLocaleDateString()}</span>
            {is_owner && draft.status !== 'published' && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handlePublish={handlePublish}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      
      {draft.image && (
        <div className="text-center">
          <img src={draft.image} alt="Draft content" className={styles.DraftImage} />
        </div>
      )}
      
      <Card.Body>
        <Card.Text>{draft.content}</Card.Text>
        <div className={styles.DraftMeta}>
          <span>Status: {draft.status}</span>
          {draft.scheduled_time && (
            <span>Scheduled: {new Date(draft.scheduled_time).toLocaleString()}</span>
          )}
          <span>Created: {new Date(draft.created_at).toLocaleDateString()}</span>
        </div>
        
        {/* Publish Button für nicht veröffentlichte Drafts */}
        {is_owner && draft.status !== 'published' && (
          <div className="text-center mt-3">
            <button 
              className={`btn ${styles.PublishButton}`}
              onClick={handlePublish}
            >
              Publish Now
            </button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

Draft.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.string,
    author_profile_id: PropTypes.number,
    author_profile_image: PropTypes.string,
    updated_at: PropTypes.string,
    status: PropTypes.string,
    scheduled_time: PropTypes.string,
    created_at: PropTypes.string,
    image: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  setDrafts: PropTypes.func.isRequired,
};

export default Draft;