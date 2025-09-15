import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Draft.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import Avatar from "../../components/Avatar";
import { axiosReq } from "../../api/axiosDefaults";
import { toast } from "react-toastify";

const Draft = ({ draft, setDrafts }) => {
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === draft.author;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/drafts/${draft.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      await axiosReq.delete(`/drafts/${draft.id}/`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        results: prevDrafts.results.filter((d) => d.id !== draft.id),
      }));

      toast.success("Draft deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting draft:", err);
      toast.error("Failed to delete draft.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handlePublish = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      
      // Titel aus dem Draft oder Inhalt generieren, falls nicht vorhanden
      let publishTitle = draft.title;
      if (!publishTitle || publishTitle.trim() === "") {
        publishTitle = draft.content.slice(0, 50) + (draft.content.length > 50 ? "..." : "");
      }

      await axiosReq.put(
        `/drafts/${draft.id}/publish/`,
        { title: publishTitle }, // Titel im Request-Body mitsenden
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        results: prevDrafts.results.filter((d) => d.id !== draft.id),
      }));

      toast.success("Draft published successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (err) {
      console.error("Error publishing draft:", err);
      
      // Spezifische Fehlermeldung anzeigen
      if (err.response?.data?.title) {
        toast.error(`Publish failed: ${err.response.data.title[0]}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to publish draft.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
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
            {is_owner && draft.status !== "published" && (
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
          <img
            src={draft.image}
            alt="Draft content"
            className={styles.DraftImage}
          />
        </div>
      )}

      <Card.Body>
        {draft.title && <Card.Title>{draft.title}</Card.Title>}
        <Card.Text>{draft.content}</Card.Text>
        <div className={styles.DraftMeta}>
          <span>Status: {draft.status}</span>
          <span>
            Created: {new Date(draft.created_at).toLocaleDateString()}
          </span>
        </div>

        {is_owner && draft.status !== "published" && (
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
    created_at: PropTypes.string,
    image: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  setDrafts: PropTypes.func.isRequired,
};

export default Draft;