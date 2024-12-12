import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        router.push('/login');
        return;
      }

      if (session?.user) {
        const metadata = session.user.user_metadata;
        
        if (metadata?.restaurant_id) {
          try {
            // Create the restaurant profile
            const { error: profileError } = await supabase
              .from('restaurant_profiles')
              .insert({
                user_id: session.user.id,
                restaurant_id: metadata.restaurant_id,
                role: metadata.role || 'admin'
              });

            if (profileError) throw profileError;

            // Redirect to dashboard
            router.push(`/restaurants/${metadata.restaurant_id}/dashboard`);
          } catch (error) {
            console.error('Error creating profile:', error);
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, []);

  return <div>Setting up your account...</div>;
};

export default AuthCallback; 