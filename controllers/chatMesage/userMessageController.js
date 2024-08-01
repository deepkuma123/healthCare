const User = require("../../models/userModel");

const allUsersByInitialName = async (req, res, next) => {
  try {
    // Fetch users from MongoDB and sort by name in ascending order
    const users = await User.find()
      .sort({ name: 1 })
      .select("id name email avatar");

    console.log({ users });
    // Group users by the initial letter of their name
    const usersGroupByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });

    // console.log(OnlineUser);

    // Send the grouped users in the response
    return res.status(200).send({ users: usersGroupByInitialLetter });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  allUsersByInitialName,
};
