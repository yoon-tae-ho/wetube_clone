import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 80, trim: true },
  description: { type: String, required: true, minLength: 20, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

const getHashtagArr = (hashtagStr) => {
  let result = hashtagStr.split(",");
  result = result.map((word) => {
    let newWord = word.trim();
    return newWord.startsWith("#") ? newWord : `#${newWord}`;
  });
  return result;
};

videoSchema.pre("save", async function () {
  this.hashtags = getHashtagArr(this.hashtags[0]);
  console.log(this);
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
