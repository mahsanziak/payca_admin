import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import Sidebar from '../../../components/Sidebar';

const RecommendationsPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
\      <main className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 flex-1 p-6`}>
        <div className="recommendations-box bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-4xl text-center font-bold mb-4">Recommendations</h2>
          <hr className="fine-line mb-4" />
          <div className="no-recommendations text-center text-gray-700">
            <i className="fas fa-lightbulb text-3xl mb-2"></i>
            <p className="text-xl">You do not have any recommendations yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
