import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the email and password (for demonstration purposes)
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Redirect to the dashboard regardless of input
    router.push(`/restaurants/1/dashboard`); // Adjust the path as needed
  };

  const handleCreateAccount = () => {
    router.push('/register'); // Redirect to the register page
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className="text-2xl mb-4 text-center">Payca</h2>
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