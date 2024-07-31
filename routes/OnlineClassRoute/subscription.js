const express = require('express');
const { getSubscriptionForUser, checkSubscriptionAccess, createSubscription } = require('../../controllers/onlineClassControllers/subscriptionController');
const router = express.Router();
 // Example: 30 days subscription duration

// Subscribe a user to a class
router.post('/subscribe',createSubscription);

// Get subscriptions for a specific user
router.get('/:userId/subscriptions', getSubscriptionForUser);
  
router.get('/check-access/:userId/:classId', checkSubscriptionAccess);


module.exports = router;
