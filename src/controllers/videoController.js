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
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render("watch", { pageTitle: `${video.title}`, video });
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
export const postUpload = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const hashtagArr = getHashtagArr(hashtags);
    await Video.create({
      title,
      description,
      hashtags: hashtagArr,
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

// etc.

const getHashtagArr = (hashtagStr) => {
  let result = hashtagStr.split(",");
  result = result.map((word) => {
    let i = null;
    let isHash = false;
    for (i = 0; i < word.length; ++i) {
      if (word[i] === " ") {
        continue;
      } else if (word[i] === "#") {
        isHash = true;
        break;
      } else {
        break;
      }
    }
    const newWord = word.slice(i);
    return isHash === true ? newWord : `#${newWord}`;
  });
  return result;
};
