import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comment = ({
  profile_id,
  profile_image,
  owner,
  updated_at,
  content,
  id,
  setPost,
  setComments,
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState(profile_image);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  useEffect(() => {
    const fetchCurrentProfileImage = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${profile_id}/`);
        if (data.image && data.image !== profile_image) {
          setCurrentProfileImage(data.image);
        }
      } catch (err) {
        console.log("Could not fetch updated profile image");
      }
    };

    fetchCurrentProfileImage();
  }, [profile_id, profile_image]);

  const handleDelete = async () => {
    const access_token = localStorage.getItem("access_token");
    try {
      await axiosRes.delete(`/comments/${id}/`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));

      toast.success("Comment deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to delete comment.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={currentProfileImage} height={40} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <Link to={`/profiles/${profile_id}`}>
            <span className={styles.Owner}>{owner}</span>
            <span className={styles.Date}>{updated_at}</span>
          </Link>

          {showEditForm ? (
            <CommentEditForm
              id={id}
              content={content}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>

        {is_owner && !showEditForm && (
          <MoreDropdown handleEdit={() => setShowEditForm(true)} handleDelete={handleDelete} />
        )}
      </Media>
    </>
  );
};

Comment.propTypes = {
  profile_id: PropTypes.number.isRequired,
  profile_image: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  setPost: PropTypes.func.isRequired,
  setComments: PropTypes.func.isRequired,
};

export default Comment;
