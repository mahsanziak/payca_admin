import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/login.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      // First, create the restaurant record
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: restaurantName,
          address: restaurantAddress,
          pricing_tier: 'Basic'
        })
        .select('id')
        .single();

      if (restaurantError) throw restaurantError;

      // Then sign up the user with metadata including the restaurant ID
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            restaurant_id: restaurantData.id,
            restaurant_name: restaurantName,
            role: 'admin'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;

      // Show success message and redirect
      alert('Please check your email to verify your account. After verification, you can log in.');
      router.push('/login');

    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleEmailSignup} className={`${styles.form} max-w-md mx-auto p-6`}>
        <h2 className="text-2xl mb-4 text-center">Payca Registration</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="restaurantName" className="block mb-2">Restaurant Name</label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="border rounded w-full p-3"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="restaurantAddress" className="block mb-2">Restaurant Address</label>
          <input
            type="text"
            id="restaurantAddress"
            value={restaurantAddress}
            onChange={(e) => setRestaurantAddress(e.target.value)}
            className="border rounded w-full p-3"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-3"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-3"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full p-3"
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className={styles.link}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
