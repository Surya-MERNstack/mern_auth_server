import user from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "Signup successfully" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await user.findOne({ email });

    if (!validUser) return next(errorHandler(401, "user not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 360000); // 1 hour
    res
      .cookie("access_token", token, { expires: expiryDate, secure: true, domain: "mern-auth-servers.onrender.com"  })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const users = await user.findOne({ email: req.body.email });
    if (users) {
      const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET);
      const { password: hashPassword, ...rest } = users._doc;
      const expiryDate = new Date(Date.now() + 360000); // 1 hour
      res
        .cookie("access_token", token, {  expires: expiryDate ,secure: true, domain: "mern-auth-servers.onrender.com"})
        .status(200)
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new user({
        username: req.body.name.split(' ').join('').toLowerCase() +Math.floor( Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashPassword,
        profilePicture : req.body.photo
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 360000); // 1 hour
      res
        .cookie("access_token", token, { secure: true, domain: "mern-auth-servers.onrender.com" ,expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};


export const signout = async(req, res) => {
  res.clearCookie('access_token').status(200).json({message : "SingOut Success"})
}  