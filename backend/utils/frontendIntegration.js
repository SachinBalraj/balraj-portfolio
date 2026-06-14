/*
===========================
  Frontend Integration Guide
===========================

  1. Install Axios in your React frontend:

     npm install axios

  2. Create an API utility file (e.g., src/utils/api.js):

=============================================
// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const submitConsultation = async (data) => {
  const response = await api.post('/consultation', data);
  return response.data;
};

export default api;
=============================================

  3. Contact Form Submit (example):

=============================================
import { useState } from 'react';
import { submitContact } from '../utils/api';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        subject: e.target.subject.value,
        message: e.target.message.value,
      };

      const result = await submitContact(data);

      if (result.success) {
        alert('Message submitted successfully!');
        e.target.reset();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
=============================================

  4. Consultation Form Submit (example):

=============================================
import { useState } from 'react';
import { submitConsultation } from '../utils/api';

const ConsultationForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        company: e.target.company.value,
        investmentBudget: e.target.investmentBudget.value,
        meetingDate: e.target.meetingDate.value,
        meetingTime: e.target.meetingTime.value,
        notes: e.target.notes.value,
      };

      const result = await submitConsultation(data);

      if (result.success) {
        alert('Consultation request submitted!');
        e.target.reset();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
=============================================

  5. Environment variable (.env in React project root):

    VITE_API_URL=http://localhost:5001/api

  6. Add loading state to your Submit button:

     <button type="submit" disabled={loading}>
       {loading ? 'Submitting...' : 'Send Message'}
     </button>
*/
