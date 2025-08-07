import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import  {verifyToken}  from "../config/verifyToken.js";


const router = express.Router();

//register user
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) res.json({ message: "This email alraedy registered" });

    const hashedPass = await bcrypt.hash(password, 10);

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const newUser = new User({ userName, email, password: hashedPass });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new user" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) res.status(401).json({ message: "Invalid password" });

    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30s",
    });
    res.status(200).json({
      message: "User Logged in",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/getAll", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.json({ message: "User id is required" });
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { userName, email } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    res.send(error);
  }
});

export default router;
