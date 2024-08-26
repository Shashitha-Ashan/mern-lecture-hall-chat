const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "lecturer", "student"],
    default: "student",
  },
  year: {
    type: String,
    enum: ["19/20", "20/21", "21/22", "22/23"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  confirmation: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiration: {
    type: Date,
    default: null,
  },
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user.confirmation) {
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        return user;
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      throw new Error("User not found");
    }
  } else {
    throw new Error("You are not verified please verify your email");
  }
};
// add users

userSchema.statics.register = async function (
  name,
  email,
  password,
  role,
  year
) {
  try {
    const user = await this.findOne({ email });

    if (user) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await this.create({
      username: name,
      email,
      password: hash,
      role,
      year,
      confirmation: false,
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};

// change password
userSchema.statics.changePassword = async function (
  email,
  password,
  newPassword
) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.findOne({ email, password: hash });

  if (user) {
    // Now hash the new password
    const newHash = await bcrypt.hash(newPassword, salt);
    user.password = newHash;
    await user.save();
    return true; // Password changed successfully
  } else {
    throw new Error("Email and password doesn't match");
  }
};

userSchema.statics.getUserRole = async function (userID) {
  const user = await this.findById(userID);

  if (user) {
    return user;
  } else {
    throw new Error("User not found");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
