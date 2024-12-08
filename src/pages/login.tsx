import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient'; // Import Supabase client
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error messages
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch user data from the database
      const { data, error } = await supabase
        .from('client_logins')
        .select('password_hash, restaurant_id')
        .eq('email', email)
        .single(); // Get a single record

      if (error) {
        setError('Invalid email or password.');
        console.error('Error fetching user:', error);
        return;
      }

      // Verify the password (assuming bcrypt for hashing)
      const isPasswordValid = await verifyPassword(password, data.password_hash);
      if (!isPasswordValid) {
        setError('Invalid email or password.');
        return;
      }

      // Redirect to the restaurant's dashboard
      router.push(`/restaurants/${data.restaurant_id}/dashboard`);
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    router.push('/register'); // Redirect to the register page
  };

  // Function to simulate password verification
  const verifyPassword = async (inputPassword: string, hash: string): Promise<boolean> => {
    // Replace this with a real password verification function (e.g., bcrypt.compare)
    return inputPassword === hash; // Replace this with bcrypt comparison
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className="text-2xl mb-4 text-center">Payca</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Show error */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2"
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
            className="border rounded w-full p-2"
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button 
            onClick={handleCreateAccount} 
            className={styles.link}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
