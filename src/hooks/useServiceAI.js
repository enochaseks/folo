import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const useServiceAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const functions = getFunctions();

  const recommendServices = async (userPreferences, browsingHistory, location) => {
    try {
      setLoading(true);
      setError(null);
      const recommendServicesCallable = httpsCallable(functions, 'recommendServices');
      const result = await recommendServicesCallable({
        userPreferences,
        browsingHistory,
        location
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const detectPaymentFraud = async (transaction, userHistory, marketConditions) => {
    try {
      setLoading(true);
      setError(null);
      const detectPaymentFraudCallable = httpsCallable(functions, 'detectPaymentFraud');
      const result = await detectPaymentFraudCallable({
        transaction,
        userHistory,
        marketConditions
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const predictServiceQuality = async (serviceData, userHistory, marketData) => {
    try {
      setLoading(true);
      setError(null);
      const predictServiceQualityCallable = httpsCallable(functions, 'predictServiceQuality');
      const result = await predictServiceQualityCallable({
        serviceData,
        userHistory,
        marketData
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateSmartNotifications = async (userActivity, notificationHistory, preferences) => {
    try {
      setLoading(true);
      setError(null);
      const generateSmartNotificationsCallable = httpsCallable(functions, 'generateSmartNotifications');
      const result = await generateSmartNotificationsCallable({
        userActivity,
        notificationHistory,
        preferences
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    recommendServices,
    detectPaymentFraud,
    predictServiceQuality,
    generateSmartNotifications
  };
}; 