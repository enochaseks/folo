import { functions } from '../pages/firebase';
import { httpsCallable } from 'firebase/functions';

export const aiPaymentService = {
  // AI-powered fraud detection
  detectPaymentFraud: httpsCallable(functions, 'detectPaymentFraud'),
  
  // Smart payment routing
  optimizePaymentRoute: httpsCallable(functions, 'optimizePaymentRoute'),
  
  // Dynamic pricing
  calculateDynamicPrice: httpsCallable(functions, 'calculateDynamicPrice'),
  
  // Payment success prediction
  predictPaymentSuccess: httpsCallable(functions, 'predictPaymentSuccess'),
  
  // Personalized payment options
  suggestPaymentMethods: httpsCallable(functions, 'suggestPaymentMethods'),
  
  // Transaction analysis
  analyzeTransaction: httpsCallable(functions, 'analyzeTransaction')
};

export const usePaymentAI = () => {
  const processPayment = async (paymentData) => {
    try {
      // Check for fraud
      const fraudCheck = await aiPaymentService.detectPaymentFraud(paymentData);
      if (fraudCheck.data.isFraudulent) {
        throw new Error('Suspicious transaction detected');
      }

      // Get optimized payment route
      const paymentRoute = await aiPaymentService.optimizePaymentRoute(paymentData);
      
      // Calculate dynamic price
      const dynamicPrice = await aiPaymentService.calculateDynamicPrice(paymentData);
      
      // Predict payment success
      const successPrediction = await aiPaymentService.predictPaymentSuccess(paymentData);
      
      return {
        success: true,
        route: paymentRoute.data,
        price: dynamicPrice.data,
        prediction: successPrediction.data
      };
    } catch (error) {
      console.error('AI payment processing error:', error);
      return { success: false, error: error.message };
    }
  };

  return { processPayment };
}; 