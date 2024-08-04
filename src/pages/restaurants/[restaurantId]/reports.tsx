import { useRouter } from 'next/router';
import styles from '../../../components/Reports.module.css';

const ReportsPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;

  const handleNavigation = (path: string) => {
    router.push(`/restaurants/${restaurantId}${path}`);
  };

  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.title} text-3xl font-bold`}>Reports</h2>
      <div className={`${styles.gridContainer}`}>
        <div
          className={`${styles.reportItem}`}
          onClick={() => handleNavigation('/sales-revenue-reports')}
          style={{ cursor: 'pointer' }}
        >
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-chart-line fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Sales and Revenue Reports</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Detailed analysis of sales trends and revenue.</span>
        </div>
        <div
          className={`${styles.reportItem}`}
          onClick={() => handleNavigation('/customer-turnover-reports')}
          style={{ cursor: 'pointer' }}
        >
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-clock fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Customer Duration and Table Turnover</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Insights into customer dining duration and table efficiency.</span>
        </div>
        <div className={`${styles.reportItem}`}>
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-headset fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Customer Service and Interaction Reports</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Evaluation of customer service interactions and feedback.</span>
        </div>
        <div className={`${styles.reportItem}`}>
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-clipboard-list fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Order Analysis Reports</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Coming Soon!</span>
        </div>
        <div className={`${styles.reportItem}`}>
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-truck-loading fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Inventory and Supply Chain Reports</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Coming Soon!</span>
        </div>
        <div className={`${styles.reportItem}`}>
          <div className={`${styles.reportContent}`}>
            <i className="fas fa-user-friends fa-2x mb-4 text-gray-700"></i>
            <h3 className="text-xl font-semibold">Customer Demographics and Behavior</h3>
          </div>
          <span className={`${styles.reportDescription}`}>Coming Soon!</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
