const fakeVideos = [
  {
    title: "first video",
    ratings: 5,
    conmments: 2,
    createdAt: "2 years ago",
    views: 109,
    id: 1,
  },
  {
    title: "second video",
    ratings: 5,
    conmments: 2,
    createdAt: "2 years ago",
    views: 109,
    id: 2,
  },
  {
    title: "third video",
    ratings: 5,
    conmments: 2,
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
export const watchVideo = (req, res) =>
  res.render("watch", { pageTitle: "Watch" });
export const editVideo = (req, res) =>
  res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => res.send("Delete Video!");
export const uploadVideo = (req, res) => res.send("Upload your video!");
