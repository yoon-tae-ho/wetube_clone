import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcryptjs";
import fetch from "node-fetch";

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
      videos: [],
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
    const user = await User.findOne({ username, socialOnly: false });
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  try {
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const apiUrl = "https://api.github.com";

      const userData = await (
        await fetch(`${apiUrl}/user`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();

      const emailData = await (
        await fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();

      const emailObj = emailData.find(
        (emailObj) => emailObj.primary && emailObj.verified
      );
      if (!emailObj) {
        return res.redirect("/login");
      }
      console.log(userData);
      let user = await User.findOne({ email: emailObj.email });
      if (!user) {
        // create account
        user = await User.create({
          email: emailObj.email,
          avatarUrl: userData.avatar_url,
          socialOnly: true,
          username: userData.login,
          password: `${Math.round(Math.random() * 10000000000)}`,
          name: userData.name ? userData.name : "Unknown",
          location: userData.location,
        });
      }
      // Login
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    } else {
      return res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
  }
};

export const logout = async (req, res) => {
  await req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  try {
    // update DB
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
    // update session
    req.session.user = updatedUser;
    // code challange
    // email, username의 unique 검사
    return res.redirect("/users/edit");
  } catch (err) {
    console.error(err);
  }
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) {
    return res.redirect("/users/edit");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  try {
    // old password confirmation
    const isMatch = await bcrypt.compare(oldPassword, password);
    if (!isMatch) {
      return res.status(400).render("users/change-password", {
        pageTitle: "Change Password",
        errorMessage: "The old password dose not correct.",
      });
    }
    // old and new password confirmation
    if (oldPassword === newPassword) {
      return res.status(400).render("users/change-password", {
        pageTitle: "Change Password",
        errorMessage:
          "The new password must be different from the previous one.",
      });
    }
    // new password confirmation
    if (newPassword != newPassword2) {
      return res.status(400).render("users/change-password", {
        pageTitle: "Change Password",
        errorMessage: "The new password confirmation dose not match.",
      });
    }
    // change password in DB
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    // reset session
    req.session.destroy();
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
};

export const seeUser = async (req, res) => {
  const {
    params: { username },
  } = req;
  try {
    const user = await User.findOne({ username }).populate("videos");
    if (!user) {
      return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/profile", { pageTitle: username, user });
  } catch (err) {
    console.error(err);
  }
};

export const deleteUser = (req, res) => res.send("Delete User!");
