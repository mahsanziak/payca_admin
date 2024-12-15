import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../../components/Recommendations.module.css';

const RecommendationsPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.title} text-3xl font-bold`}>Recommendations</h2>
      <div className={`${styles.recommendationBox}`}>
        <h3 className="text-xl font-semibold">This feature is coming soon!</h3>
      </div>
    </div>
  );
};

export default RecommendationsPage;
