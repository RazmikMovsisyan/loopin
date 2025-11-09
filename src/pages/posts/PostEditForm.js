import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Form, Button, Row, Col, Container, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const { title, content, image } = postData;
  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const { data } = await axiosReq.get(`/posts/${id}/`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const { title, content, image, is_owner } = data;
        
        if (!is_owner) {
          history.push("/");
          return;
        }
        
        setPostData({ title, content, image });
      } catch (err) {
        // Silent redirect if post doesn't exist or other error
        history.push("/");
      }
    };
    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setPostData({ ...postData, [event.target.name]: event.target.value });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const access_token = localStorage.getItem("access_token");
      await axiosReq.put(`/posts/${id}/`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      toast.success("Post updated successfully!");
      history.push(`/posts/${id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        history.push("/");
      } else {
        toast.error("Failed to update post.");
        if (err.response?.status !== 401) setErrors(err.response?.data);
      }
    } finally {
      setUploading(false);
    }
  };

  const textFields = (isMobile = false) => (
    <div className="text-center">
      <Form.Group>
        <Form.Label htmlFor={`edit-title-${isMobile ? 'mobile' : 'desktop'}`}>Title</Form.Label>
        <Form.Control 
          id={`edit-title-${isMobile ? 'mobile' : 'desktop'}`}
          type="text" 
          name="title" 
          value={title} 
          onChange={handleChange} 
        />
      </Form.Group>
      {errors?.title?.map((msg, idx) => <Alert key={idx} variant="warning">{msg}</Alert>)}

      <Form.Group>
        <Form.Label htmlFor={`edit-content-${isMobile ? 'mobile' : 'desktop'}`}>Content</Form.Label>
        <Form.Control 
          id={`edit-content-${isMobile ? 'mobile' : 'desktop'}`}
          as="textarea" 
          rows={6} 
          name="content" 
          value={content} 
          onChange={handleChange} 
        />
      </Form.Group>
      {errors?.content?.map((msg, idx) => <Alert key={idx} variant="warning">{msg}</Alert>)}

      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={() => history.goBack()} disabled={uploading}>
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit" disabled={uploading}>
        {uploading ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={7} lg={8} className="py-2 p-0 p-md-2">
          <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center">
              {image && (
                <figure>
                  <Image className={appStyles.Image} src={image} rounded />
                </figure>
              )}
              <div className="mt-2 text-center">
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
                <Form.File
                  id="image-upload"
                  accept="image/*"
                  ref={imageInput}
                  onChange={handleChangeImage}
                  className="d-none"
                />
              </div>
            </Form.Group>
            {errors?.image?.map((msg, idx) => <Alert key={idx} variant="warning">{msg}</Alert>)}
            <div className="d-md-none">{textFields(true)}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields(false)}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;
