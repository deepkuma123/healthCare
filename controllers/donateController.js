const DonationItem = require('../models/donations');
// const DonationCategory = require('../models/donationCategory');
const DonationCategory = require('../models/donationCategory'); // Adjust the path according to your project structure


const donateList = async (req,res) =>{
    try {
        const { title, description, imageURL, category,address } = req.body;
        const user = req.user;
        const existingCategory = await DonationCategory.findById(category);

        console.log({existingCategory});

        if (!existingCategory) {
            return res.status(400).json({ message: 'Category not found' });
        }
        

        const newItem = new DonationItem({
          title,
          description,
          imageURL,
        //   quantity,
          category:existingCategory,
          user,
          address
        }); 
      const donateItem = await newItem.save();
    // res.redirect('/donate');
    res.status(200).json({
      userdonateItemDetails:donateItem,
      success:true,
      msg:"Donation Item Created Successfully"
    })
  } catch (error) {
    res.status(500).json({ message: error });
  }

}

const donationCategory = async (req,res)=>{
    try {
        const userId = req.user._id; // Using authenticated user ID
        const { name } = req.body;
    
        // Create new category
        const category = new DonationCategory({ name, user: userId });
        await category.save();
    
        // Associate category with the user
        // req.user.hobbies.push(category._id);
        // await req.user.save();
    
        res.status(201).json({category:category,success:true});
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
}
const donateCategory = async (req,res)=>{
    try {
          // Create new category
        const category = await DonationCategory.find();
        res.status(201).json({category:category,success:true});
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
}

const donationItems = async (req, res) => {
  try {
      // Find all donation items and populate the category field
      const donationItems = await DonationItem.find().populate('category').populate("user");

      // Send the donation items in the response
      res.status(200).json({ donationItems });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = {
    donateList,
    donationCategory,
    donationItems,
    donateCategory
}