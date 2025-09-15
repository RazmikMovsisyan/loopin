import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Container, Alert, Image } from "react-bootstrap";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useRedirect } from "../../hooks/useRedirect";
import { useDrafts } from "../../contexts/DraftsContext";
import { axiosReq } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DraftEditForm = () => {
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [draftData, setDraftData] = useState({
    title: "",
    content: "",
    image: "",
    status: "draft",
  });
  const { title, content, status } = draftData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const { setDrafts } = useDrafts();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const { data } = await axiosReq.get(`/drafts/${id}/`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        const { title, content, image, status, is_owner } = data;

        if (is_owner) {
          setDraftData({ title, content, image, status });
          setHasLoaded(true);
        } else {
          history.push("/");
        }
      } catch (err) {
        console.error("Error loading draft:", err);
        toast.error("Failed to load draft.", { 
          position: "top-right", 
          autoClose: 3000 
        });
      }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setDraftData({ 
      ...draftData, 
      [event.target.name]: event.target.value 
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(draftData.image);
      setDraftData({
        ...draftData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!title.trim()) {
      setErrors({ title: ["Title is required"] });
      return;
    }
    
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      if (imageInput.current.files.length) {
        formData.append("image", imageInput.current.files[0]);
      }

      const access_token = localStorage.getItem("access_token");
      const { data: updatedDraft } = await axiosReq.put(
        `/drafts/${id}/`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );

      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        results: prevDrafts.results.map((d) =>
          d.id === updatedDraft.id ? updatedDraft : d
        ),
      }));

      toast.success("Draft updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      history.push("/drafts");
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.data) {
        setErrors(err.response.data);
      }
      toast.error("Failed to update draft.", { 
        position: "top-right", 
        autoClose: 3000 
      });
    } finally {
      setUploading(false);
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="Enter a title for your draft"
          required
        />
      </Form.Group>
      {errors?.title?.map((msg, idx) => (
        <Alert key={idx} variant="warning">{msg}</Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Write your content here..."
        />
      </Form.Group>
      {errors?.content?.map((msg, idx) => (
        <Alert key={idx} variant="warning">{msg}</Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue} mr-2`}
        onClick={() => history.goBack()}
        disabled={uploading}
      >
        Cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        type="submit"
        disabled={uploading}
      >
        {uploading ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  if (!hasLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={7} lg={8} className="py-2 p-0 p-md-2">
          <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center">
              {draftData.image && (
                <>
                  <figure>
                    <Image 
                      className={appStyles.Image} 
                      src={draftData.image} 
                      rounded 
                    />
                  </figure>
                  <div className="text-center">
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change Image
                    </Form.Label>
                  </div>
                </>
              )}

              {!draftData.image && (
                <Form.Label 
                  className="d-flex justify-content-center" 
                  htmlFor="image-upload"
                >
                  <Asset 
                    src={Upload} 
                    message="Click or tap to upload an image" 
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((msg, idx) => 
              <Alert key={idx} variant="warning">{msg}</Alert>
            )}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>

        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default DraftEditForm;
