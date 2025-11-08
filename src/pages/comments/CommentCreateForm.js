import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function CommentCreateForm({ post, setPost, setComments }) {
  const [content, setContent] = useState("");
  const [currentProfileImage, setCurrentProfileImage] = useState("");
  const { getAuthHeader } = useAuth();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (currentUser?.profile_id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${currentUser.profile_id}/`);
          setCurrentProfileImage(data.image);
        } catch (err) {
          setCurrentProfileImage(currentUser?.profile_image);
        }
      }
    };

    fetchCurrentProfile();
  }, [currentUser]);

  const handleChange = (event) => setContent(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post(
        "/comments/",
        { content, post },
        { headers: getAuthHeader() }
      );

      setComments((prev) => ({
        ...prev,
        results: [data, ...prev.results],
      }));

      setPost((prev) => ({
        results: [
          {
            ...prev.results[0],
            comments_count: prev.results[0].comments_count + 1,
          },
        ],
      }));

      setContent("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) handleSubmit(event);
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${currentUser?.profile_id}`}>
            <Avatar src={currentProfileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="Write a comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={2}
          />
        </InputGroup>
        <small className="text-muted d-block text-center mt-1">
          Shift + Enter → New line
        </small>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!content.trim()}
        type="submit"
      >
        Post
      </button>
    </Form>
  );
}

CommentCreateForm.propTypes = {
  post: PropTypes.number.isRequired,
  setPost: PropTypes.func.isRequired,
  setComments: PropTypes.func.isRequired,
};

export default CommentCreateForm;
