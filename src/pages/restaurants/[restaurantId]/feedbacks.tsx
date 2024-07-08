import React from 'react';
import Link from 'next/link';
import styles from '../../../components/feedbacks.module.css'; // Adjust the import path if needed


const FeedbacksPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Feedbacks</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Items ordered</th>
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
    </div>
  );
};

export default FeedbacksPage;
