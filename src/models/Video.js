import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  title: { type: String, required: true, maxLength: 80, trim: true },
  description: { type: String, required: true, minLength: 20, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  let result = hashtags.split(",");
  result = result.map((word) => {
    let newWord = word.trim();
    return newWord.startsWith("#") ? newWord : `#${newWord}`;
  });
  return result;
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
