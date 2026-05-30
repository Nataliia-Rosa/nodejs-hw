import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/index.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: TAGS[0],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'note',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ tag: 1 });
noteSchema.index({ title: 'text', content: 'text' });

export const Note = model('note', noteSchema);
