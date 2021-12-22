import Video from "../models/Video";

// For globalRouters

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch (err) {
    console.error(err);
  }
};

export const search = (req, res) => res.send("Search!");

// For videoRouters

export const watchVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    res.render("watch", { pageTitle: `${video.title}`, video });
  } catch (err) {
    console.error(err);
    res.render("404", { pageTitle: "Video not found" });
  }
};

export const getEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
  } catch (err) {
    console.error(err);
    res.render("404", { pageTitle: "Video not found" });
  }
};

export const postEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    res.redirect(`/videos/${id}`);
  } catch (err) {
    console.error(err);
    res.render("404", { pageTitle: "Video not found" });
  }
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("404", { pageTitle: "Video not found" });
  }
};

// etc.
