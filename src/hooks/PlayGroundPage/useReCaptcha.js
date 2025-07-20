// useReCaptcha.js
import { useState, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

export const useReCaptcha = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateCaptcha = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/pigo-stream/recaptcha/verify-recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validateCaptcha, loading, error };
};