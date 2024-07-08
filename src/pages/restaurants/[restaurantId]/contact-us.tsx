import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import styles from '../../../components/contactus.module.css'; // Adjust the import path if needed
import emailjs from 'emailjs-com';

const ContactUsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const router = useRouter();
  const { restaurantId } = router.query;

  useEffect(() => {
    const fetchRestaurantName = async () => {
      if (restaurantId) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('name')
          .eq('id', restaurantId)
          .single();
        if (data) {
          setRestaurantName(data.name);
        } else {
          console.error('Error fetching restaurant name:', error.message);
        }
      }
    };

    fetchRestaurantName();
  }, [restaurantId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      subject: `Message from ${restaurantName}`,
    };

    emailjs
      .send(
        'service_wramyag', // Replace with your EmailJS service ID
        'template_kom8o78', // Replace with your EmailJS template ID
        templateParams,
        'dgqtM4wKsfGFceZV6' // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setName('');
          setEmail('');
          setMessage('');
          alert('Message sent successfully!');
        },
        (error) => {
          console.error('FAILED...', error);
          alert('Failed to send message. Please try again later.');
        }
      );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contact Us</h2>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            id="message"
            rows={4} // Corrected to number type
            placeholder="Please feel free to leave us a message and we will get back to you within 2 hours. Alternatively, you can opt to use our chatbot on the bottom right!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUsPage;
