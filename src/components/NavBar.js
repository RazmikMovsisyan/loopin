import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosReq } from "../api/axiosDefaults";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const { logout } = useSetCurrentUser();
  const [currentProfileImage, setCurrentProfileImage] = useState("");

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  // Check for logout success message on component mount
  useEffect(() => {
    const showLogoutMessage = localStorage.getItem("showLogoutSuccess");
    if (showLogoutMessage) {
      toast.success("Signed out successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      // Remove the flag so it doesn't show again
      localStorage.removeItem("showLogoutSuccess");
    }
  }, []);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (currentUser?.profile_id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${currentUser.profile_id}/`);
          setCurrentProfileImage(data.image);
        } catch (err) {
          const fallbackImage = 
            !currentUser?.profile_image ||
            currentUser?.profile_image.includes("default_profile_rxsxdv") ||
            currentUser?.profile_image.startsWith("../")
              ? "https://res.cloudinary.com/dj5p9ubcu/image/upload/v1750632467/default_profile_rxsxdv.jpg"
              : currentUser?.profile_image;
          setCurrentProfileImage(fallbackImage);
        }
      }
    };

    fetchCurrentProfile();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      // Set flag in localStorage before logout
      localStorage.setItem("showLogoutSuccess", "true");
      
      // Perform logout
      await logout();
      
      // The page will refresh as part of the logout process
      // The toast will be shown on the next page load
    } catch (error) {
      // Remove the flag if logout failed
      localStorage.removeItem("showLogoutSuccess");
      toast.error("Sign out failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="far fa-plus-square"></i>Add post
    </NavLink>
  );
  
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentProfileImage} text="Profile" height={40} />
      </NavLink>
    </>
  );
  
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;