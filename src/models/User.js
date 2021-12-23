import mongoose, { STATES } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 5;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  console.log(this.password);
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  console.log(this.password);
});

const User = mongoose.model("User", userSchema);

export default User;
