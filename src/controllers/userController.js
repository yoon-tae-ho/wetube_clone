import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  try {
    const { name, email, password, password2, username, location } = req.body;
    if (password !== password2) {
      return res.render("join", {
        pageTitle: "Join",
        errorMessage: "Password confirmation dose not match.",
      });
    }
    const userExist = await User.exists({ $or: [{ username }, { email }] });
    if (userExist) {
      return res.status(400).render("join", {
        pageTitle: "Join",
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
  }
};
export const login = (req, res) => res.send("Login!");
export const editUser = (req, res) => res.send("Edit User!");
export const deleteUser = (req, res) => res.send("Delete User!");
export const seeUser = (req, res) => res.send("See user!");
export const logoutUser = (req, res) => res.send("Logout!");
