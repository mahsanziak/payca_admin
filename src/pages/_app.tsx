import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Sidebar from '../components/Sidebar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false); // Skip session checks
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Check if the current route is the login or register page
  const isLoginPage = router.pathname === '/login';
  const isRegisterPage = router.pathname === '/register';

  return (
    <div className="flex">
      {/* Only show the sidebar if not on the login or register page */}
      {!isLoginPage && !isRegisterPage && (
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <main className={`${sidebarOpen && !isLoginPage && !isRegisterPage ? 'ml-64' : 'ml-16'} transition-all duration-300 flex-1 p-6`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
