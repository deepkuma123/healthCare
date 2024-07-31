const Community = require("../models/community");
const ShareMeet = require("../models/sharemeet");

exports.createCommunity = async (req, res) => {
  try {
    const { shareMeetIds } = req.body;
    const creatorId = req.user._id;
    console.log(req.user._id);
    const community = new Community({
      creator: creatorId,
      members: [creatorId],
      shareMeets: shareMeetIds,
    });
    await community.save();
    res.status(201).send(community);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
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
