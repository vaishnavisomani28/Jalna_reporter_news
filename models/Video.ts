import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: Date;
  isLive: boolean;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    channelId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
VideoSchema.index({ videoId: 1 });
VideoSchema.index({ isLive: 1 });
VideoSchema.index({ publishedAt: -1 });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;

