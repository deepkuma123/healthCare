// Helper function to check if a subscription is active
const isSubscriptionActive = (expirationDate) => {
    return new Date() < new Date(expirationDate);
  };

  module.exports = {
    isSubscriptionActive
  }
  