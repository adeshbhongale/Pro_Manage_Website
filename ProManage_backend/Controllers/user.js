const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ errorMessage: "Bad Request!: Enter All Credentials" });
    }

    const isExistingEmail = await User.findOne({ email: email });
    if (isExistingEmail) {
      return res.status(409).json({ errorMessage: "Email already exists!" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ errorMessage: "Password doesn't match" });
    }

    // password hashing using bcrypt module for password encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });

    await userData.save();

    res.json({ message: "User Registered Successfully!" });
  } catch (error) {
    next(error);
  }
};

// Login User API (User Details check and Password Match with JWT token generation)

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request! : Enter Both Credentials",
      });
    }
    const userDetails = await User.findOne({ email: email });
    if (!userDetails) {
      return res.status(401).json({ errorMessage: "User Doesn't Exist!" });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        userId: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
      },
      process.env.SECRET_CODE,
      { expiresIn: "5h" }
    );

    res.json({
      Message: "User Logged In Successfully!",
      token: token,
      name: userDetails.name,
      email: userDetails.email,
    });
  } catch (error) {
    next(error);
  }
};

const addEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userId = req.userId;
    if (!email) {
      return res
        .status(400)
        .json({ errorMessage: "Bad Request! : Enter valid email" });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(401).json({ errorMessage: "User Doesn't Exist!" });
    }

    const isExistingEmail = userDetails.addPeople.some(
      (data) => data.addEmail === email
    );

    if (isExistingEmail) {
      return res.status(409).json({ errorMessage: "Email already exists!" });
    }

    userDetails.addPeople.push({ addEmail: email });
    await userDetails.save();
    res.json({ message: "Email Added Successfully!" });
  } catch (error) {
    next(error);
  }
};

const addedPeople = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find the user by ID and select only the addedPeople field
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.addPeople);
  } catch (error) {
    next(error);
  }
};

const updateCredentials = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, email, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    let updatedFields = {};
    if (name) {
      if (name !== user.name) {
        updatedFields.name = name;
      } else {
        return res
          .status(400)
          .json({ errorMessage: "Name can't be same as Before!" });
      }
    }
    if (email) {
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ errorMessage: "Email already exists" });
        }
        updatedFields.email = email;
      } else {
        return res
          .status(400)
          .json({ errorMessage: "Email can't be same as Before!" });
      }
    }
    if (oldPassword && newPassword) {
      if (oldPassword !== newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ errorMessage: "Old password is incorrect" });
        }
        updatedFields.password = await bcrypt.hash(newPassword, 10);
      } else {
        return res
          .status(400)
          .json({ errorMessage: "Old and New Password cannot be Equal!" });
      }
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );
    res.json({ message: "Credentials updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  addEmail,
  addedPeople,
  updateCredentials,
};
