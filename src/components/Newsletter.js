import React, { useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../styles/Newsletter.module.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosReq.post('/newsletter/subscribe/', { email });
      setMessage('Successfully subscribed to our newsletter!');
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.Newsletter}>
      <h5>Subscribe to our Newsletter</h5>
      {!isSubscribed ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      ) : (
        <p className={styles.Success}>{message}</p>
      )}
      {message && !isSubscribed && <p className={styles.Error}>{message}</p>}
    </div>
  );
};

export default Newsletter;