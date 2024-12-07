import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../components/feedbacks.module.css'; // Adjust the import path if needed

interface Feedback {
  id: string;
  feedback_text: string;
  rating: number;
  created_at: string;
}

// Utility function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Add ordinal suffix to the day
  const dayWithSuffix = day + (['th', 'st', 'nd', 'rd'][(day % 10 > 3 || [11, 12, 13].includes(day % 100)) ? 0 : day % 10]);
  return `${dayWithSuffix} ${month}, ${year}`;
};

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
        setFeedbacks(data || []);
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
                <td>{formatDate(feedback.created_at)}</td>
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
