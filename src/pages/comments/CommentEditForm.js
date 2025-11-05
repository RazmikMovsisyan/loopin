import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { axiosRes } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import styles from "../../styles/CommentCreateEditForm.module.css";
import { useAuth } from "../../contexts/AuthContext";

function CommentEditForm({ id, content, setShowEditForm, setComments }) {
  const [formContent, setFormContent] = useState(content);
  const { getAuthHeader } = useAuth();

  const handleChange = (event) => setFormContent(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(
        `/comments/${id}/`,
        { content: formContent.trim() },
        { headers: getAuthHeader() }
      );

      setComments((prev) => ({
        ...prev,
        results: prev.results.map((c) =>
          c.id === id
            ? { ...c, content: formContent.trim(), updated_at: "now" }
            : c
        ),
      }));

      setShowEditForm(false);
      toast.success("Comment updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to update comment.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) handleSubmit(event);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={2}
          className={styles.Form}
        />
        <small className="text-muted">Shift + Enter für neue Zeile</small>
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </button>
        <button
          className={styles.Button}
          disabled={!formContent.trim()}
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
}

CommentEditForm.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  setShowEditForm: PropTypes.func.isRequired,
  setComments: PropTypes.func.isRequired,
};

export default CommentEditForm;
