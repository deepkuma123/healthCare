const category = require("../models/category");
const Community = require("../models/community");
const ShareMeet = require("../models/sharemeet");
const userModel = require("../models/userModel");
const multer = require("multer");

const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/")); // Destination path for uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // File naming logic
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size if needed (1MB here)
}).single("image");

exports.createCommunity = async (req, res) => {
  // try {
  //   const { shareMeetIds } = req.body;
  //   const creatorId = req.user._id;
  //   console.log(req.user._id);
  //   const community = new Community({
  //     creator: creatorId,
  //     members: [creatorId],
  //     shareMeets: shareMeetIds,
  //   });
  //   await community.save();
  //   res.status(201).send(community);
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).send(error);
  // }

  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.json("image file does not uploaded");
      }
      const { name } = req.body; // Extract name and hobbies from the request body
      const creatorId = req.user._id; // Get the creator's ID from req.user

      // Validate that name and hobbies are provided and hobbies is an array
      if (!name) {
        return res
          .status(400)
          .send({ message: "Name and at least one hobby are required" });
      }

      const user = await userModel.findById(req.user._id).populate("hobbies"); // Populate the hobbies field
      // Extract just the names of the hobbies
      const hobbyNames = user.hobbies.map((hobby) => hobby.name);
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded

      // Create a new Community instance with the creator, name, and hobbies
      const community = new Community({
        name, // Set the community name
        hobbies: hobbyNames, // Set the community hobbies (array)
        creator: creatorId, // Set the creator of the community
        members: [creatorId], // Add the creator as the first member of the community
        communityLogo: avatarFileName,
      });

      console.log(community);

      await community.save(); // Save the community to the database
      res.status(201).send({ community: community }); // Respond with the created community
    });
  } catch (error) {
    console.log(error); // Log any errors for debugging
    res.status(400).send({ message: "Failed to create community", error }); // Respond with a 400 status and the error
  }

  // try {
  //   const { shareMeetIds, age, gender, hobbies } = req.body;
  //   const creatorId = req.user._id;

  //   // Update the user's details
  //   const updatedUser = await User.findByIdAndUpdate(
  //     creatorId,
  //     { age, gender, hobbies },
  //     { new: true } // Return the updated document
  //   );

  //   if (!updatedUser) {
  //     return res.status(404).json({ error: "User not found" });
  //   }

  //   // Create a new community with the updated user's details
  //   const community = new Community({
  //     creator: creatorId,
  //     members: [creatorId],
  //     age: updatedUser.age,
  //     gender: updatedUser.gender,
  //     hobbies: updatedUser.hobbies,
  //     shareMeets: shareMeetIds,
  //   });

  //   await community.save();
  //   res.status(201).send(community);
  // } catch (error) {
  //   console.log({ error });
  //   res.status(400).json(error);
  // }
};

exports.communityForm = async (req, res) => {
  try {
    const user = req.user;
    const { userHobbie, gender, address } = req.body; // Expecting an array of hobby IDs

    // Validate that the hobbies exist in the Category collection
    const hobbies = await category.find({ name: { $in: userHobbie } });
    console.log(hobbies);

    if (hobbies.length !== userHobbie.length) {
      return res.status(400).json({ error: "Some hobbies do not exist" });
    }
    // Extract the hobby IDs
    const hobbyIds = hobbies.map((hobby) => hobby._id);

    // Update the user's hobbies
    user.hobbies = hobbyIds; // Assign the array of hobby IDs directly
    // user.age = age;
    user.gender = gender;
    user.address = address;
    const users = await user.save();

    const populatedUser = await userModel
      .findById(req.user._id)
      .populate("hobbies");

    console.log({ populatedUser });
    res.status(200).json({
      message: "Hobbies updated successfully",
      hobbies: populatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while updating hobbies" });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;
    const userId = req.user._id;
    console.log(userId);
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).send({ message: "community not found" });
    }

    // let community = await Community.findOne({ shareMeets: shareMeetId });

    // if (!community) {
    //   return res.status(404).send({ message: "Community not found" });
    // }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res
        .status(400)
        .send({ message: "User is already a member of this community" });
    }

    // Add user to community members
    community.members.push(userId);
    await community.save();

    res.status(200).send(community);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllCommunityDetails = async (req, res) => {
  try {
    const community = await Community.find()
      .populate("creator")
      .populate("members");

    if (!community) {
      return res.status(404).send({ message: "Community not found" });
    }

    res.status(200).send(community);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCommunityDetails = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator")
      .populate("members");

    if (!community) {
      return res.status(404).send({ message: "Community not found" });
    }

    res.status(200).send(community);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCommunity = async (req, res) => {
  try {
    // Fetch the user's hobbies
    const user = await userModel.findById(req.user._id).populate("hobbies");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // const userHobbies = user.hobbies;
    const hobbyNames = user.hobbies.map((hobby) => hobby.name);

    console.log(hobbyNames);
    if (hobbyNames.length === 0) {
      return res.status(200).send({ message: "No hobbies found for the user" });
    }

    // Query the communities that have any of the user's hobbies
    const communities = await Community.find({ hobbies: { $in: hobbyNames } });
    console.log(communities);
    res.status(200).send(communities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error fetching communities", error });
  }
};
