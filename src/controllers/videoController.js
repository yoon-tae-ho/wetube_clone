import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// For globalRouters

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (err) {
    console.error(err);
  }
};

export const search = async (req, res) => {
  try {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
      videos = await Video.find({
        title: {
          $regex: new RegExp(keyword, "i"),
        },
      }).populate("owner");
    }
    res.render("search", { pageTitle: "Search", videos });
  } catch (err) {
    console.error(err);
    res.status(404).render("404", { pageTitle: "Video not found" });
  }
};

// For videoRouters

export const watchVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate("owner")
      .populate("comments");
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found" });
    }
    return res.render("watch", { pageTitle: `${video.title}`, video });
  } catch (err) {
    console.error(err);
  }
};

export const getEdit = async (req, res) => {
  try {
    const {
      params: { id },
      session: {
        user: { _id },
      },
    } = req;
    const video = await Video.findById(id);
    // video dose not exist.
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found" });
    }
    // the user is not owner of this video
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
  } catch (err) {
    console.error(err);
  }
};

export const postEdit = async (req, res) => {
  try {
    const {
      params: { id },
      body: { title, description, hashtags },
      session: {
        user: { _id },
      },
    } = req;
    const video = await Video.findById(id);
    // video dose not exist.
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found" });
    }
    // the user is not owner of this video
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect("/");
    }
    // update video
    video.title = title;
    video.description = description;
    video.hashtags = Video.formatHashtags(hashtags);
    await video.save();
    res.redirect(`/videos/${id}`);
  } catch (err) {
    console.error(err);
  }
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    file: { path: fileUrl },
  } = req;
  try {
    const video = await Video.create({
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(video._id);
    await user.save();
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
    const {
      params: { id },
      session: {
        user: { _id },
      },
    } = req;
    const video = await Video.findById(id);
    // video dose not exist.
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found" });
    }
    // the user is not owner of this video
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect("/");
    }
    // delete in videos collection of DB
    await video.deleteOne();
    // delete in user.videos of DB
    const user = await User.findById(_id);
    const newVideos = user.videos.filter(
      (videoId) => String(videoId) !== String(id)
    );
    user.videos = newVideos;
    await user.save();
    return res.redirect("/");
  } catch (err) {
    console.error(err);
  }
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  try {
    const video = await Video.findById(id);
    const dbUser = await User.findById(user._id);
    if (!video || !user) {
      return res.sendStatus(404);
    }
    const comment = await Comment.create({
      text,
      owner: user._id,
      video: id,
    });
    video.comments = [comment._id, ...video.comments];
    dbUser.comments = [comment._id, ...dbUser.comments];
    video.save();
    dbUser.save();
    return res.status(201).json({ newCommentId: comment._id });
  } catch (err) {
    console.error(err);
  }
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  try {
    const comment = await Comment.findById({ _id: id });
    if (String(user._id) !== String(comment.owner)) {
      return res.sendStatus(403);
    }
    if (!comment) {
      return res.sendStatus(404);
    }
    await Comment.findByIdAndDelete(id);
    const owner = await User.findById(comment.owner);
    const newUserComments = owner.comments.filter(
      (comment) => String(comment._id) !== String(id)
    );
    owner.comments = newUserComments;
    owner.save();
    const video = await Video.findById(comment.video);
    const newVideoComments = video.comments.filter(
      (comment) => String(comment._id) !== String(id)
    );
    video.comments = newVideoComments;
    video.save();
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
};
