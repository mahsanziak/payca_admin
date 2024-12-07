import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css'; // Reuse the styles from the login page

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); // State for restaurant name
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Log the email, password, and restaurant name (for demonstration purposes)
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Restaurant Name:', restaurantName);

    // Here you would typically call your API to create the account
    // For now, we'll just redirect to the login page
    router.push('/login'); // Redirect to the login page after registration
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-md mx-auto p-6`}>
        <h2 className="text-2xl mb-4 text-center">Payca</h2>
        <div className="mb-4">
          <label htmlFor="restaurantName" className="block mb-2">Restaurant Name</label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="border rounded w-full p-3" // Increased padding
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
            className="border rounded w-full p-3" // Increased padding
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
            className="border rounded w-full p-3" // Increased padding
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
            className="border rounded w-full p-3" // Increased padding
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