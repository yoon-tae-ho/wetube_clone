import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  try {
    const { name, email, password, password2, username, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
      return res.render("join", {
        pageTitle,
        errorMessage: "Password confirmation dose not match.",
      });
    }
    const userExist = await User.exists({ $or: [{ username }, { email }] });
    if (userExist) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "The username/email already exists.",
      });
    }
    await User.create({
      name,
      email,
      password,
      username,
      location,
    });
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res
      .status(404)
      .render("join", { pageTitle: "Unexpected error occured." });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  try {
    const user = await User.findOne({ username });
    // Username validation
    if (!user) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username dose not exists.",
      });
    }

    // Password validation
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "Password does not correct.",
      });
    }

    // Login
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } catch (err) {
    console.error(err);
  }
};

export const editUser = (req, res) => res.send("Edit User!");
export const deleteUser = (req, res) => res.send("Delete User!");
export const seeUser = (req, res) => res.send("See user!");
export const logoutUser = (req, res) => res.send("Logout!");
