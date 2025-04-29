import { useState } from 'react';
import axios from 'axios';

export default function useSecureFeedbackSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitFeedback = async (formPayload) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(formPayload)) {
        if (key === 'files') {
          value.forEach((file) => formData.append('files', file));
        } else if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            formData.append(subKey, subValue);
          }
        } else {
          formData.append(key, value);
        }
      }

      const res = await axios.post('/api/feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess(true);
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
