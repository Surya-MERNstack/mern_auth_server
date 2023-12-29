import user from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.send("<h1>Hello Bot</h1>");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401), "You can update only you account");
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};


export const deleteUser = async (req, res, next) => {
   if(req.user.id !== req.params.id){
    return next(errorHandler(401, "You can delete only your account"))
   }

   try {
    await user.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted")
   }catch(err){

   }
}