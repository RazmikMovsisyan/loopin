import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import Container from 'react-bootstrap/Container';
import appStyles from '../App.module.css'

const Unsubscribe = () => {
  const { code } = useParams();
  const [message, setMessage] = useState('Processing your unsubscribe request...');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        await axiosReq.post(`/newsletter/unsubscribe/${code}/`);
        setMessage('You have been successfully unsubscribed from our newsletter.');
      } catch (err) {
        setMessage('Invalid unsubscribe link. Please contact support if you continue to receive emails.');
      }
    };

    unsubscribe();
  }, [code]);

  return (
    <Container className={appStyles.Content}>
      <h2>Newsletter Unsubscribe</h2>
      <p>{message}</p>
    </Container>
  );
};

export default Unsubscribe;