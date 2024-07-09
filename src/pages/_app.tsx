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
    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth change detected:', event, session);
      if (session) {
        const user = session.user;
        const restaurantId = user?.user_metadata?.restaurant_id;
        if (restaurantId) {
          console.log(`Navigating to /restaurants/${restaurantId}/dashboard`);
          // router.push(`/restaurants/${restaurantId}/dashboard`);
        } else {
          console.error('Restaurant ID not found in user_metadata');
        }
      } else {
        console.log('No session found, redirecting to root');
        // router.push('/');
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log('Session check:', session);
      if (session) {
        const user = session.user;
        const restaurantId = user?.user_metadata?.restaurant_id;
        if (restaurantId) {
          console.log(`Session found. Navigating to /restaurants/${restaurantId}/dashboard`);
          // router.push(`/restaurants/${restaurantId}/dashboard`);
        } else {
          console.error('Restaurant ID not found in user_metadata');
        }
      } else {
        console.log('No active session found, redirecting to root');
        // router.push('/');
      }
      setLoading(false);
    };

    checkSession();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 flex-1 p-6`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
