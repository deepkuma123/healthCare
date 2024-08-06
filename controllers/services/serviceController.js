const Service = require("../../models/services/serviceModal");
const User = require("../../models/userModel");
const multer = require("multer");
const axios = require("axios");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/")); // Destination path for uploaded files
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

const createService = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Error uploading file.");
        return res.redirect("/register");
      }
      // const userId = req.user._id; // Using authenticated user ID
      const { name } = req.body;
      const avatarFileName = req.file ? req.file.filename : null; // Check if avatar file was uploaded
      console.log(req.file);
      // Create new category
      const category = new Service({ name, categoryIcon: avatarFileName });
      await category.save();

      res.status(201).send(category);
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getService = async (req, res) => {
  try {
    // Create new category
    const services = await Service.find();
    res.status(200).json({ services: services, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const nearByLocation = async (req, res) => {
  const { lat, lng, radius, serviceName } = req.body;

  if (!lat || !lng || !radius || !serviceName) {
    return res.status(400).json({
      error: "Latitude, longitude, radius, and service name are required.",
    });
  }

  try {
    // Fetch nearby places using Google Places API for the single service type
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          keyword: serviceName,
          key: "AIzaSyARf505VVJ_bn-5BnQ5qFbyKqWGF4DRn9U", // Use environment variable for API key
        },
      }
    );

    const nearbyPlaces = response.data.results;

    // Prepare the results
    const results = {
      serviceType: serviceName,
      places: nearbyPlaces.map((place) => ({
        name: place.name,
        address: place.vicinity,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      })),
    };

    res.status(200).json(results);
  } catch (error) {
    console.error(`Error finding nearby services for ${serviceName}:`, error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nearby services." });
  }
};

module.exports = {
  createService,
  getService,
  nearByLocation,
};
