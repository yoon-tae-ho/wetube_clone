import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 5;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
  videos: [{ type: mongoose.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

const User = mongoose.model("User", userSchema);

export default User;
