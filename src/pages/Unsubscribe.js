import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import Container from 'react-bootstrap/Container';
import appStyles from '../App.module.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Unsubscribe = () => {
  const { code } = useParams();

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        await axiosReq.post(`/newsletter/unsubscribe/${code}/`);
        toast.success(
          'You have been successfully unsubscribed from our newsletter.',
          { position: 'top-right' }
        );
      } catch (err) {
        toast.error(
          'Invalid unsubscribe link. Please contact support if you continue to receive emails.',
          { position: 'top-right' }
        );
      }
    };

    unsubscribe();
  }, [code]);

  return (
    <Container className={appStyles.Content}>
      <h2>Newsletter Unsubscribe</h2>
      <p>Please check the toast notifications for the result of your request.</p>
    </Container>
  );
};

export default Unsubscribe;
