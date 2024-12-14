import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // Track if user is resetting password
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.restaurant_id) {
        router.push(`/restaurants/${session.user.user_metadata.restaurant_id}/dashboard`);
      }
    };
    checkUser();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.user_metadata?.restaurant_id) {
        router.push(`/restaurants/${data.user.user_metadata.restaurant_id}/dashboard`);
      } else {
        setError('Unable to find associated restaurant. Please contact support.');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsResetting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      alert('Password reset email has been sent.');
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleEmailLogin} className={styles.form}>
        <h2 className={styles.title}>Sign in to Payca</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.linkContainer}>
          <button 
            type="button"
            onClick={handleForgotPassword} 
            className={styles.link}
            disabled={isResetting}
          >
            {isResetting ? 'Sending reset email...' : 'Forgot Password?'}
          </button>
        </div>

        <div className={styles.linkContainer}>
          <p className={styles.text}>Don&apos;t have an account?</p>
          <button 
            type="button"
            onClick={() => router.push('/register')} 
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
