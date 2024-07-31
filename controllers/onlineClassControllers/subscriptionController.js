const Subscription = require('../../models/onlineClasses/Subscription');
const classModel = require('../../models/onlineClasses/classModel');
const userModel = require('../../models/userModel');

const {isSubscriptionActive} = require('../../helpers/isSubscriptionActive')

// Subscribe a user to a class
const SUBSCRIPTION_DURATION_DAYS = 30;


const createSubscription = async (req, res) => {
    try {
      const { userId, classId } = req.body;
  
      // Verify that the class exists
      const classInstance = await classModel.findById(classId);
      if (!classInstance) {
        return res.status(404).json({ error: 'Class not found' });
      }
  
      // Check if the user already has an active subscription for the class
      const existingSubscription = await Subscription.findOne({ userId, classId });
      if (existingSubscription) {
        // If an existing subscription is found, check if it's still active
        if (isSubscriptionActive(existingSubscription.expirationDate)) {
          return res.status(400).json({ error: 'User already has an active subscription for this class' });
        } else {
          return res.status(400).json({ error: 'User has an expired subscription for this class. Please renew it.' });
        }
      }
  
      // Create a new subscription with expiration date
      const subscription = new Subscription({
        userId,
        classId,
        expirationDate: new Date(Date.now() + SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000) // Set expiration date
      });
  
      await subscription.save();
  
      // Add subscription to user
      await userModel.findByIdAndUpdate(userId, { $push: { subscriptions: subscription._id } });
  
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


// const getSubscriptionForUser =  async (req, res) => {
//     try {
//       const user = await userModel.findById(req.params.userId).populate({
//         path: 'subscriptions',
//         populate: { path: 'classId' },
//       });
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       res.json(user.subscriptions);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }


  
const getSubscriptionForUser = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.userId).populate({
        path: 'subscriptions',
        populate: { path: 'classId' },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      

      // Add status to each subscription
      const subscriptionsWithStatus = user.subscriptions.map(subscription => ({
        ...subscription.toObject(),
        isActive: isSubscriptionActive(subscription.expirationDate),
      }));
  
      res.json(subscriptionsWithStatus);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Check if the user has an active subscription for a specific class
const checkSubscriptionAccess = async (req, res) => {
    try {
      const { userId, classId } = req.params;
  
      // Retrieve the user's subscription for the class
      const subscription = await Subscription.findOne({ userId, classId });
      console.log({subscription});
  
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
  
      // Check if the subscription is active
      const isActive = isSubscriptionActive(subscription.expirationDate);
      console.log({isActive});
      res.json({
        access: isActive,
        message: isActive ? 'Subscription is active' : 'Subscription is either inactive or expired',
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  
  

  module.exports = {
    createSubscription,
    getSubscriptionForUser,
    checkSubscriptionAccess
  }