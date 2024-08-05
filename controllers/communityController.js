const category = require("../models/category");
const Community = require("../models/community");
const ShareMeet = require("../models/sharemeet");
const userModel = require("../models/userModel");

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
    const { shareMeetIds, age, gender, hobbies } = req.body;
    const creatorId = req.user._id;

    // Update the user's details
    const updatedUser = await User.findByIdAndUpdate(
      creatorId,
      { age, gender, hobbies },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new community with the updated user's details
    const community = new Community({
      creator: creatorId,
      members: [creatorId],
      age: updatedUser.age,
      gender: updatedUser.gender,
      hobbies: updatedUser.hobbies,
      shareMeets: shareMeetIds,
    });

    await community.save();
    res.status(201).send(community);
  } catch (error) {
    console.log({ error });
    res.status(400).json(error);
  }
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
    res
      .status(200)
      .json({
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
    const { shareMeetId } = req.body;
    const userId = req.user._id;
    console.log(userId);
    const shareMeet = await ShareMeet.findById(shareMeetId);

    if (!shareMeet) {
      return res.status(404).send({ message: "ShareMeet not found" });
    }

    let community = await Community.findOne({ shareMeets: shareMeetId });

    if (!community) {
      return res.status(404).send({ message: "Community not found" });
    }

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
      .populate("members")
      .populate("shareMeets");

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
      .populate("members")
      .populate("shareMeets");

    if (!community) {
      return res.status(404).send({ message: "Community not found" });
    }

    res.status(200).send(community);
  } catch (error) {
    res.status(500).send(error);
  }
};
