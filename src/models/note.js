import { TAGS } from '../constants/tags.js';
import mongoose, { Schema } from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index({ tag: 1 });
noteSchema.index({ userId: 1 });

export const Note = mongoose.model('Note', noteSchema);
