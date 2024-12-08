import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient'; // Supabase client
import styles from '../styles/login.module.css'; // Reuse the styles from the login page

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); // State for restaurant name
  const [restaurantAddress, setRestaurantAddress] = useState(''); // State for restaurant address
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Insert into restaurants table
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: restaurantName,
          address: restaurantAddress,
          pricing_tier: 'Basic', // Default pricing tier
        })
        .select('id')
        .single(); // Get the newly created restaurant's ID

      if (restaurantError || !restaurantData) {
        setError('Failed to create restaurant. Please try again.');
        console.error('Restaurant creation error:', restaurantError);
        return;
      }

      const restaurantId = restaurantData.id;

      // Insert into client_logins table
      const { error: clientLoginError } = await supabase
        .from('client_logins')
        .insert({
          email,
          password_hash: password, // Use hashing in production
          restaurant_id: restaurantId,
          role: 'admin', // Default role
        });

      if (clientLoginError) {
        setError('Failed to create user account. Please try again.');
        console.error('Client login creation error:', clientLoginError);
        return;
      }

      // Redirect to the new restaurant's dashboard
      router.push(`/restaurants/${restaurantId}/dashboard`);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-md mx-auto p-6`}>
        <h2 className="text-2xl mb-4 text-center">Payca</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Show error message */}
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
        <button type="submit" className={styles.button}>
          Register
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
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
