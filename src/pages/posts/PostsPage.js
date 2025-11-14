import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function PostsPage({ message, filter = "" }) {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const checkScrollTop = useCallback(() => {
    if (!showScrollTop && window.pageYOffset > 300) {
      setShowScrollTop(true);
    } else if (showScrollTop && window.pageYOffset <= 300) {
      setShowScrollTop(false);
    }
  }, [showScrollTop]);

  const loadMorePosts = useCallback(() => {
    if (displayedPosts.length < allPosts.length) {
      setCurrentPage(prev => prev + 1);
    }
  }, [displayedPosts.length, allPosts.length]);

  const checkScrollBottom = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePosts();
    }
  }, [loadMorePosts]); // loadMorePosts als Abhängigkeit hinzugefügt

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    window.addEventListener('scroll', checkScrollBottom);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
      window.removeEventListener('scroll', checkScrollBottom);
    };
  }, [checkScrollTop, checkScrollBottom]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const endIndex = currentPage * postsPerPage;
    setDisplayedPosts(allPosts.slice(0, endIndex));
  }, [allPosts, currentPage]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Load once
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setAllPosts(data.results);
        setHasLoaded(true);
        setCurrentPage(1); // Zurück zur ersten Seite bei neuer Suche
      } catch (err) {
        // Error handling removed for production
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {pathname === "/" && !currentUser && (
          <div className={styles.WebsiteDescription}>
          <h3>Welcome to LoopIn!</h3>
          <p>Discover exciting posts, share your creative ideas and connect with the community.<br />
       Search for content, follow other users and interact with posts that inspire you.<br />
       Stay in the Loop!</p>
        </div>
        )}
        
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            id="search-posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>

        {hasLoaded ? (
          <>
            {displayedPosts.length ? (
              <div>
                {displayedPosts.map((post) => (
                  <Post key={post.id} {...post} setPosts={setAllPosts} />
                ))}
                
                {displayedPosts.length < allPosts.length && (
                  <div className="text-center my-3">
                    <Asset spinner />
                    <p>Loading more posts...</p>
                  </div>
                )}
              </div>
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
      {showScrollTop && (
        <Button 
          variant="primary" 
          className={styles.ScrollTop} 
          onClick={scrollTop}
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </Button>
      )}
    </Row>
  );
}

PostsPage.propTypes = {
  message: PropTypes.string.isRequired,
  filter: PropTypes.string,
};

export default PostsPage;