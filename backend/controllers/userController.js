const User = require("../models/userModel");
const Report = require("../models/reportsModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

function sendConfirmEmail(id, email) {
  const confirmationLink = `${process.env.URL}/api/user/confirm/${id}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirmation Email",
    text: confirmationLink,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    res.cookie("credentials", createToken(user._id), {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send("Successfully logged");
  } catch (error) {
    res.status(401).send(error.message);
  }
};
const reportUser = async (req, res) => {
  const { messageid, reason } = req.body;
  const reporterid = req.user._id;
  try {
    await Report.create({ reporterid, messageid, reason });
    res
      .status(200)
      .send({ message: "Reported successfully investigation ongoing" });
  } catch (error) {
    res.status(400).send("Unknown Error");
  }
};

const changePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    const user = await User.changePassword(email, password, newPassword);
  } catch (error) {
    res.send("Email and password doesn't match");
  }
};
const registerUser = async (req, res) => {
  const { username, email, password, role, year } = req.body;
  try {
    const newUser = await User.register(username, email, password, role, year);
    const userId = newUser._id;
    const taken = createToken(userId);
    if (taken) {
      sendConfirmEmail(taken, email);
    }

    return res
      .status(200)
      .json({ message: "Your confirmation email has been sent your email" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// testing purpose
const getUsers = async (req, res) => {
  User.find({})
    .then(function (users) {
      res.send(users);
    })
    .catch(function (err) {
      console.log(err);
    });
};

const getUserRole = async (req, res) => {
  try {
    const token = await req.cookies.credentials;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      const user = await User.getUserRole(decoded);
      if (user) {
        await User.findByIdAndUpdate(
          decoded,
          { $set: { lastLogin: Date.now() } },
          { new: true }
        );
      }
      const userCredintials = {
        username: user.username,
        role: user.role,
        id: user._id,
      };
      res.send(userCredintials);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const confirmUser = async (req, res) => {
  try {
    const token = req.params.id;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token URL" });
      }
      const user = await User.findById(decoded);
      if (user.confirmation === false) {
        const confirmedUser = await User.findByIdAndUpdate(
          decoded,
          { confirmation: true },
          { new: true }
        );
        if (!confirmedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).send("Your email has been verified");
      } else {
        res.status(200).send("Your email is already verified");
      }
    });
  } catch (error) {}
};

function sendResetEmail(email, token) {
  const resetLink = `${process.env.URL}/api/user/resetpassword/${token}`;
  console.log(resetLink);
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
           <p>Please click on the following link to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a unique token for password reset
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save the token to the user document
    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600000);
    await user.save();

    // Send reset password email to the user
    sendResetEmail(email, token);

    res.status(200).json({ message: "Reset email sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const resetPasswordVerify = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user by the resetToken
    const user = await User.findOne({ resetToken: token });
    if (user && user.resetTokenExpiration > Date.now()) {
      // Render the reset password page (assuming you're using a view engine like EJS, Pug, etc.)
      res.render("reset-password", { token });
    } else {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by the token's user ID
    const user = await User.findById(decoded._id);

    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

const hashPassword = async (plainPassword) => {
  try {
    // Generate a salt to use for hashing
    const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds as needed (10 is a common value)

    // Hash the plain password using the generated salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword; // Return the hashed password
  } catch (error) {
    // Handle error appropriately (e.g., log or throw an error)
    throw new Error("Password hashing failed");
  }
};

module.exports = {
  loginUser,
  changePassword,
  getUsers,
  registerUser,
  getUserRole,
  reportUser,
  confirmUser,
  forgotPassword,
  resetPasswordVerify,
  resetPassword,
};
