import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import Avatar from "../../components/Avatar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const { setCurrentUser } = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    content: "",
    image: "",
  });
  const { name, content, image } = profileData;

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, content, image } = data;
          setProfileData({ name, content, image });
        } catch (err) {
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("content", content);

      if (imageFile?.current?.files[0]) {
        const file = imageFile.current.files[0];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("upload_preset", "unsigned_profile_upload");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dj5p9ubcu/image/upload",
          {
            method: "POST",
            body: uploadFormData,
          }
        );
        
        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }
        
        const uploadData = await uploadRes.json();
        formData.append("image", uploadData.secure_url);
      } else {
        formData.append("image", image);
      }

      const token = localStorage.getItem("access_token");
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      
      toast.success("Profile updated successfully!", { position: "top-right" });
      history.goBack();
    } catch (err) {
      toast.error("Failed to update profile.", { position: "top-right" });
      setErrors(err.response?.data);
    } finally {
      setUploading(false);
    }
  };

  const textFields = (isMobile = false) => (
    <>
      <Form.Group>
        <Form.Label htmlFor={`profile-bio-${isMobile ? 'mobile' : 'desktop'}`}>Bio</Form.Label>
        <Form.Control
          id={`profile-bio-${isMobile ? 'mobile' : 'desktop'}`}
          as="textarea"
          value={content}
          onChange={handleChange}
          name="content"
          rows={7}
        />
      </Form.Group>

      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
        disabled={uploading}
      >
        cancel
      </Button>
      <Button 
        className={`${btnStyles.Button} ${btnStyles.Blue}`} 
        type="submit"
        disabled={uploading}
      >
        {uploading ? "Saving..." : "save"}
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              <figure>
                <Avatar src={image} height={100} alt="Profile preview" />
              </figure>

              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields(true)}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields(false)}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
