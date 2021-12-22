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

const Video = mongoose.model("Video", videoSchema);
export default Video;
