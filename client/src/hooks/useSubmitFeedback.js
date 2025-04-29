import { useState } from 'react';
import axios from 'axios';

export default function useSubmitFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitFeedback = async ({
    title,
    description,
    projectVersion,
    expiryDate,
    files,
    reaction,
    feedback,
  }) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('projectVersion', projectVersion);
      formData.append('expiryDate', expiryDate);
      formData.append('reaction', reaction);

      // Append feedback fields individually
      formData.append('featureRequests', feedback.featureRequests);
      formData.append('bugsIssues', feedback.bugsIssues);
      formData.append('positiveFeedback', feedback.positiveFeedback);
      formData.append('complaints', feedback.complaints);
      formData.append('versionFeedback', feedback.versionFeedback);

      // Append multiple files
      files.forEach((file) => {
        formData.append('files', file);
      });

      await axios.post('/api/feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loading,
    error,
    success,
  };
}
