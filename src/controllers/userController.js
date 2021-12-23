import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join!" });
};
export const postJoin = async (req, res) => {
  try {
    const { name, email, password, username, location } = req.body;
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
