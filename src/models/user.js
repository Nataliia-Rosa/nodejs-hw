import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.pre('save', function setDefaultUsername(next) {
  if (this.isModified('email')) {
    this.username = this.email;
  }

  next();
});

export const User = model('User', userSchema);
