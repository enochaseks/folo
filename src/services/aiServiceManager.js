import { useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const useServiceAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const functions = getFunctions();

  // Service Management
  const manageService = useCallback(async (serviceData) => {
    setIsLoading(true);
    try {
      const manageService = httpsCallable(functions, 'manageService');
      const result = await manageService({
        services: serviceData.services,
        location: serviceData.location,
        userPreferences: serviceData.userPreferences
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  return {
    isLoading,
    error,
    manageService
  };
};

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const functions = getFunctions();

  // Business Intelligence
  const analyzeBusinessSetup = useCallback(async (businessData) => {
    setIsLoading(true);
    try {
      const analyzeBusiness = httpsCallable(functions, 'analyzeBusinessSetup');
      const result = await analyzeBusiness({
        businessName: businessData.businessName,
        category: businessData.category,
        location: businessData.location,
        targetMarket: businessData.targetMarket
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Smart Search
  const smartSearch = useCallback(async (searchQuery, filters) => {
    setIsLoading(true);
    try {
      const search = httpsCallable(functions, 'smartSearch');
      const result = await search({
        query: searchQuery,
        filters: filters
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Customer Support
  const handleCustomerSupport = useCallback(async (supportData) => {
    setIsLoading(true);
    try {
      const support = httpsCallable(functions, 'handleCustomerSupport');
      const result = await support({
        message: supportData.message,
        context: supportData.context,
        history: supportData.history
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Marketing Analytics
  const analyzeMarketing = useCallback(async (marketingData) => {
    setIsLoading(true);
    try {
      const marketing = httpsCallable(functions, 'analyzeMarketing');
      const result = await marketing({
        campaignData: marketingData.campaignData,
        userData: marketingData.userData,
        metrics: marketingData.metrics
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Security Analysis
  const analyzeSecurity = useCallback(async (securityData) => {
    setIsLoading(true);
    try {
      const security = httpsCallable(functions, 'analyzeSecurity');
      const result = await security({
        activity: securityData.activity,
        patterns: securityData.patterns,
        context: securityData.context
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Content Management
  const manageContent = useCallback(async (contentData) => {
    setIsLoading(true);
    try {
      const content = httpsCallable(functions, 'manageContent');
      const result = await content({
        content: contentData.content,
        type: contentData.type,
        context: contentData.context
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  // Analytics and Reporting
  const generateAnalytics = useCallback(async (analyticsData) => {
    setIsLoading(true);
    try {
      const analytics = httpsCallable(functions, 'generateAnalytics');
      const result = await analytics({
        data: analyticsData.data,
        metrics: analyticsData.metrics,
        timeframe: analyticsData.timeframe
      });
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [functions]);

  return {
    isLoading,
    error,
    analyzeBusinessSetup,
    smartSearch,
    handleCustomerSupport,
    analyzeMarketing,
    analyzeSecurity,
    manageContent,
    generateAnalytics
  };
};

// Default export that includes both hooks
const aiServiceManager = {
  useServiceAI,
  useAI
};

export default aiServiceManager; 