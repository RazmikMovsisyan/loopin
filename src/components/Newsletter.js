import React, { useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../styles/Newsletter.module.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosReq.post('/newsletter/subscribe/', { email });
      toast.success(response.data.message || 'Subscription successful!', {
        position: 'top-right',
      });
      setIsSubscribed(true);
      setShowUnsubscribe(true);
      setSubscribedEmail(email); // Save email for unsubscribe
      setEmail('');
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'An error occurred. Please try again.',
        { position: 'top-right' }
      );
      // Show unsubscribe if user already entered email
      if (email) {
        setShowUnsubscribe(true);
        setIsSubscribed(true);
        setSubscribedEmail(email);
      }
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axiosReq.post('/newsletter/unsubscribe_by_email/', { email: subscribedEmail });
      toast.success('You have been successfully unsubscribed.', {
        position: 'top-right',
      });
      setIsSubscribed(false);
      setShowUnsubscribe(false);
      setSubscribedEmail('');
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'An error occurred while unsubscribing.',
        { position: 'top-right' }
      );
    }
  };

  return (
    <div className={styles.Newsletter}>
      <h5>Subscribe to our Newsletter</h5>

      {!isSubscribed ? (
        <form onSubmit={handleSubscribe}>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      ) : null}

      {showUnsubscribe && (
        <div className={styles.UnsubscribeSection}>
          <p>If you wish to unsubscribe, click here:</p>
          <button
            onClick={handleUnsubscribe}
            className={styles.UnsubscribeButton}
          >
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
