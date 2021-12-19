const fakeVideos = [
  {
    title: "first video",
    ratings: 5,
    comments: 2,
    createdAt: "2 years ago",
    views: 109,
    id: 1,
  },
  {
    title: "second video",
    ratings: 5,
    comments: 2,
    createdAt: "2 years ago",
    views: 109,
    id: 2,
  },
  {
    title: "third video",
    ratings: 5,
    comments: 2,
    createdAt: "2 years ago",
    views: 109,
    id: 3,
  },
];

// For globalRouters
export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeVideos });
export const search = (req, res) => res.send("Search!");

// For videoRouters
export const watchVideo = (req, res) => {
  const { id } = req.params;
  const video = fakeVideos[id - 1];
  res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = fakeVideos[id - 1];
  res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  fakeVideos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    ratings: 0,
    comments: 0,
    createdAt: "now",
    views: 0,
    id: fakeVideos.length + 1,
  };
  fakeVideos.push(newVideo);
  return res.redirect("/");
};
