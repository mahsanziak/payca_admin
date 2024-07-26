import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../components/Promotions.module.css'; // Adjust the import path if needed

interface Promotion {
  id: number;
  title: string;
  description: string;
  restaurant_id: string;
  start_date: string;
  end_date: string;
}

const PromotionsPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (error) {
          console.error('Error fetching promotions:', error.message);
        } else {
          setPromotions(data as Promotion[]);
        }
      }
    };

    fetchPromotions();
  }, [restaurantId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Promotions</h2>
      <div className={styles.gridContainer}>
        {promotions.length > 0 ? (
          promotions.map(promotion => (
            <div key={promotion.id} className={styles.promotionItem}>
              <h3 className={styles.promotionTitle}>{promotion.title}</h3>
              <p className={styles.description}>{promotion.description}</p>
              <p className={styles.dates}>
                {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className={styles.noData}>
            <i className="fas fa-database"></i> No promotions available
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
