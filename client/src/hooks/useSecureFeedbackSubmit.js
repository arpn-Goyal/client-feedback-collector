import { useState } from 'react';
import axios from 'axios';

export default function useSecureFeedbackSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitFeedback = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('i m in hook - FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      
      const res = await axios.post('http://localhost:4000/api/feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
           
        return { success: true };
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading, error, success };
}
