import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Form, Alert, Container, Button, Row, Col, Image } from "react-bootstrap";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { createDraft } from "../../api/axiosDrafts";
import { useRedirect } from "../../hooks/useRedirect";
import { useDrafts } from "../../contexts/DraftsContext";

const DraftCreateForm = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const imageInput = useRef(null);

  const [draftData, setDraftData] = useState({
    content: "",
    image: "",
    status: "draft",
    scheduled_time: "",
  });
  const { content, status, scheduled_time } = draftData;
  const history = useHistory();
  const { setDrafts } = useDrafts();

  const handleChange = (event) => {
    setDraftData({
      ...draftData,
      [event.target.name]: event.target.value,
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
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("status", status);
      
      if (status === "scheduled" && scheduled_time) {
        formData.append("scheduled_time", new Date(scheduled_time).toISOString());
      }
      
      if (imageInput.current.files.length) {
        formData.append("image", imageInput.current.files[0]);
      }

      const newDraft = await createDraft(formData);
      
      setDrafts(prevDrafts => ({
        ...prevDrafts,
        results: [newDraft, ...prevDrafts.results]
      }));
      
      history.push("/drafts");
    } catch (err) {
      console.log("Upload error:", err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    } finally {
      setUploading(false);
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          value={status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </Form.Control>
      </Form.Group>
      {errors?.status?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {status === "scheduled" && (
        <Form.Group>
          <Form.Label>Scheduled Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="scheduled_time"
            value={scheduled_time}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            The draft will be automatically published at the specified time.
          </Form.Text>
        </Form.Group>
      )}
      {errors?.scheduled_time?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
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
        {uploading ? "Saving..." : "Save Draft"}
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {draftData.image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={draftData.image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change Image
                    </Form.Label>
                  </div>
                </>
              ) : (
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
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

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

export default DraftCreateForm;