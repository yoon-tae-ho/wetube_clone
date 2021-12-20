import Video from "../models/Video";

// For globalRouters
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (err) {
    console.error(err);
  }
};
export const search = (req, res) => res.send("Search!");

// For videoRouters
export const watchVideo = (req, res) => {
  const { id } = req.params;

  res.render("watch", { pageTitle: `Watching:` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;

  res.render("edit", { pageTitle: `Editing:` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;

  return res.redirect("/");
};
