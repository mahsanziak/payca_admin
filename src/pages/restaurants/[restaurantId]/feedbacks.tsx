import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../components/feedbacks.module.css'; // Adjust the import path if needed

interface Feedback {
  id: string;
  feedback_text: string;
  rating: number;
  created_at: string;
}

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('id, feedback_text, rating, created_at')
        .order('created_at', { ascending: false }); // Order by the most recent feedbacks

      if (error) {
        console.error('Error fetching feedbacks:', error.message);
      } else {
        setFeedbacks(data);
      }
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Feedbacks</h2>
      {loading ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Date</th>
              <th>Time</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.noData}>
              <td colSpan={4}>
                <i className="fas fa-comment-slash faded-icon"></i>
                <span>No feedbacks Yet</span>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Date</th>
              <th>Time</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.rating}</td>
                <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                <td>{new Date(feedback.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{feedback.feedback_text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbacksPage;
