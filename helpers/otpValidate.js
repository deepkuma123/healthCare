const otpVerification = async (otpTime) => {
  try {
    console.log("Milliseconds is: " + otpTime);

    const currentTime = new Date().getTime();

    // Calculate the difference in milliseconds
    const differenceValue = currentTime - otpTime;

    // Convert the difference to minutes
    const minutes = Math.abs(differenceValue) / 1000 / 60;

    console.log("Elapsed Minutes: " + minutes);
    // Check if the elapsed time is greater than 5 minutes
    if (minutes > 5) {
      return true; // OTP expired
    }
    return false; // OTP still valid
  } catch (error) {
    console.log(error.message);
    return false; // In case of an error, treat OTP as still valid
  }
};



module.exports = {
  otpVerification,
};
