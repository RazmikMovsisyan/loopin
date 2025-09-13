import React, { useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../styles/Newsletter.module.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosReq.post('/newsletter/subscribe/', { email });
      setMessage(response.data.message || 'Subscription successful');
      setIsSubscribed(true);
      setShowUnsubscribe(true);
      setSubscribedEmail(email); // E-Mail für Unsubscribe speichern
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred. Please try again.');
      // Immer den Unsubscribe-Button anzeigen, wenn eine E-Mail eingegeben wurde
      if (email) {
        setShowUnsubscribe(true);
        setIsSubscribed(true);
        setSubscribedEmail(email); // E-Mail für Unsubscribe speichern
      }
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axiosReq.post('/newsletter/unsubscribe_by_email/', { email: subscribedEmail });
      setMessage('You have been successfully unsubscribed from our newsletter.');
      setIsSubscribed(false);
      setShowUnsubscribe(false);
      setSubscribedEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred while unsubscribing. Please try again.');
    }
  };

  return (
    <div className={styles.Newsletter}>
      <h5>Subscribe to our Newsletter</h5>
      
      {!isSubscribed ? (
        <form onSubmit={handleSubscribe}>
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
      
      {message && !isSubscribed && <p className={styles.Error}>{message}</p>}
    </div>
  );
};

export default Newsletter;