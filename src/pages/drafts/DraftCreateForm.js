import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Alert, Container } from "react-bootstrap";
import styles from "../../styles/DraftCreateEditForm.module.css";
import { createDraft } from "../../api/axiosDrafts";
import { useRedirect } from "../../hooks/useRedirect";
import { useDrafts } from "../../contexts/DraftsContext";

const DraftCreateForm = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [draftData, setDraftData] = useState({
    content: "",
    image: "",
  });
  const { content, image } = draftData;
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
      setDraftData({
        ...draftData,
        image: event.target.files[0],
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const newDraft = await createDraft(formData);
      
      setDrafts(prevDrafts => ({
        ...prevDrafts,
        results: [newDraft, ...prevDrafts.results]
      }));
      
      history.push("/drafts");
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Container className={styles.Container}>
      <h1>Draft erstellen</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Label>Inhalt</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="content"
            value={content}
            onChange={handleChange}
          />
        </Form.Group>
        {errors.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <Form.Group controlId="image">
          <Form.Label>Bild</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleChangeImage} />
        </Form.Group>
        {errors.image?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <button type="submit">Draft speichern</button>
        {errors.non_field_errors?.map((message, idx) => (
          <Alert variant="warning" key={idx} className="mt-3">
            {message}
          </Alert>
        ))}
      </Form>
    </Container>
  );
};

export default DraftCreateForm;